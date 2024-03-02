const assert = require("assert");

const bedrock = require("bedrock-protocol");
const advertisement = require("bedrock-protocol/src/server/advertisement");
const rak = require("bedrock-protocol/src/rak");

const s = require("./util/consoleStyle");
const { Vec3, BlockPosition } = require("./util/data");
const { emitEx } = require("./util/emitEx");
const { FinishException } = require("./exception/finishException");
const { Event } = require("./event/event");
const { Form } = require("./mc/form");
const { Text } = require("./mc/text");
const { Player } = require("./mc/player");

// @ts-ignore
const { RakClient } = rak("raknet-native");

class Bot extends bedrock.Client {
    players = {};

    constructor(config, { show_form = true, auto_close_form = true, auto_respawn = true }) {
        super(config);
        this.showForm = show_form;
        this.autoCloseForm = auto_close_form;
        this.autoRespawn = auto_respawn;

        // 监听玩家列表更新事件
        this.on("player_list", (param) => {
            // 复制列表, 便于事件处理
            const newPlayers = { ...this.players };

            if (param.records.type == "add") {
                // 添加玩家
                for (let player_data of param.records.records) {
                    if (newPlayers[player_data.uuid]) return;

                    // @ts-ignore
                    let player = new Player(this, player_data);
                    emitEx(this, "player_join", player, (new_data) => {
                        if (new_data) player = new_data;
                        newPlayers[player_data.uuid] = player;
                    });
                }
            } else if (param.records.type == "remove") {
                // 移除玩家
                for (let player_data of param.records.records) {
                    let player = newPlayers[player_data.uuid];
                    emitEx(this, "player_leave", player, () => {
                        delete newPlayers[player_data.uuid];
                    });
                }
            }

            emitEx(this, "player_list_update", newPlayers, (new_data) => {
                if (new_data) this.players = new_data.players;
            });
        });

        this.on("text", (param) => {
            let time = new Date().toLocaleTimeString();
            let message = new Text(param);
            emitEx(this, "message", message, (new_data) => {
                if (new_data) message = new_data;
                if (["chat", "raw", "announcement", "translation", "json", "whisper"].includes(message.type))
                    if (message.sourceName) {
                        console.log(s.mc(`${time} [${message.type}] <${message.sourceName}> ${message.render()}`));
                    } else {
                        console.log(s.mc(`${time} [${message.type}] ${message.render()}`));
                    }
            });
        });

        this.on("modal_form_request", (param) => {
            // @ts-ignore
            let form = new Form(this, param);
            if (this.currentForm && this.autoCloseForm) {
                // emitEx(this,"form_close")
                console.log(s.mc(`[form] 表单未完成, 新的表单 ${form.title} (id:${form.id}) 已自动关闭`));
                form.busy();
            } else {
                emitEx(this, "form", form, (new_data) => {
                    if (new_data) form = new_data;
                    this.currentForm = form;
                    console.log("[form]");
                    if (this.showForm) form.show();
                });
            }
        });

        this.on("respawn", (param) => {
            if (this.autoRespawn) this.respawn(param);
        });

        this.on("connect_allowed", () => {
            this.connect();
        });

        this.on("connected", () => {
            console.log("[bot] Bot connected!");

            this.once("resource_packs_info", (packet) => {
                this.write("resource_pack_client_response", {
                    response_status: "completed",
                    resourcepackids: [],
                });
                this.once("resource_pack_stack", (stack) => {
                    this.write("resource_pack_client_response", {
                        response_status: "completed",
                        resourcepackids: [],
                    });
                });
                this.queue("client_cache_status", { enabled: false });
                this.queue("tick_sync", { request_time: BigInt(Date.now()), response_time: 0n });
                setTimeout(() => {
                    // @ts-ignore
                    this.queue("request_chunk_radius", { chunk_radius: this.viewDistance || 10 });
                }, 500);
            });
            // Send tick sync packets every 10 ticks
            const keepAliveInterval = 10;
            const keepAliveIntervalBig = BigInt(keepAliveInterval);
            let keepalive;
            this.tick = 0n;
            this.once("spawn", () => {
                console.log("[bot] bot spawned");
                keepalive = setInterval(() => {
                    // Client fills out the request_time and the server does response_time in its reply.
                    this.queue("tick_sync", { request_time: this.tick, response_time: 0n });
                    this.tick += keepAliveIntervalBig;
                }, 50 * keepAliveInterval);

                this.on("tick_sync", async (packet) => {
                    this.emit("heartbeat", packet.response_time);
                    this.tick = packet.response_time;
                });
            });
            this.once("close", () => {
                console.log("[bot] Bot Closed!");
                clearInterval(keepalive);
            });
        });
    }

    async connect() {
        const ad = await this.ping();
        const message =
            `§b====== §rServer Info §b======§r\n` +
            `motd: \t\t${ad.motd}\n` +
            `version: \t${ad.version}\n` +
            `player: \t${ad.playersOnline}/${ad.playersMax}\n`;
        console.log(s.mc(message));

        // @ts-ignore
        super.connect();
        this.emit("connected");
    }

    async ping() {
        // @ts-ignore
        const client = new RakClient(this.options);
        try {
            return advertisement.fromServerName(await client.ping());
        } finally {
            client.close();
        }
    }

    chat(message) {
        this.queue("text", {
            type: "chat",
            needs_translation: false,
            // @ts-ignore
            source_name: this.username,
            xuid: "",
            platform_chat_id: "",
            message: message,
        });
    }

    command(command) {
        this.queue("command_request", {
            command: command,
            origin: {
                type: "player",
                uuid: "",
                request_id: "",
            },
            internal: false,
            version: 52,
        });
    }

    action(id, { position = new BlockPosition(), result_position = new BlockPosition(), face = 0 }) {
        this.queue("player_action", {
            runtime_entity_id: this.entityId,
            action: id,
            position,
            result_position,
            face,
        });
    }

    respawn(data) {
        switch (data.state) {
            case 0:
                this.queue("respawn", {
                    runtime_entity_id: this.entityId,
                    state: 2,
                    position: new Vec3(),
                });
                break;
            case 1:
                this.action(7, {});
                break;
        }
    }

    responseForm(form_id, data) {
        this.write("modal_form_response", {
            form_id: form_id,
            has_response_data: true,
            data: JSON.stringify(data),
            has_cancel_reason: false,
        });
    }

    cancelForm(form_id, reason) {
        this.write("modal_form_response", {
            form_id: form_id,
            has_response_data: false,
            has_cancel_reason: true,
            cancel_reason: reason,
        });
    }
}

module.exports = { Bot };
