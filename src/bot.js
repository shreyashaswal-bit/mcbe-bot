const assert = require("assert");

const bedrock = require("bedrock-protocol");
const advertisement = require("bedrock-protocol/src/server/advertisement");
const auth = require("bedrock-protocol/src/client/auth");
const rak = require("bedrock-protocol/src/rak");
const { ping } = require("bedrock-protocol/src/createClient");
const { sleep } = require("bedrock-protocol/src/datatypes/util");

const s = require("./util/consoleStyle");
const { Form } = require("./mc/form");
const { translation } = require("./mc/text");
const { Vec3, BlockPosition } = require("./util/data");
const { renderJsonMessage } = require("./mc/text");
const { Player } = require("./mc/player");

const { RakClient } = rak("raknet-native");

class Bot extends bedrock.Client {
    players = {};
    currentForm = null;

    constructor(config, { show_form = true, auto_close_form = true, auto_respawn = true }) {
        super(config);
        this.showForm = show_form;
        this.autoCloseForm = auto_close_form;
        this.autoRespawn = auto_respawn;

        this.on("player_list", (param) => {
            if (param.records.type == "add") {
                param.records.records.forEach((player_data) => {
                    if (this.players[player_data.uuid]) return;
                    const player = new Player(this, player_data);
                    this.players[player_data.uuid] = player;
                    this.emit("player_join", player);
                });
            } else if (param.records.type == "remove") {
                param.records.records.forEach((player_data) => {
                    this.emit("player_leave", this.players[player_data.uuid]);
                    delete this.players[player_data.uuid];
                });
            }
            this.emit("player_list_update", this.players);
        });

        this.on("text", (param) => {
            let time = new Date().toLocaleTimeString();
            let message = "";
            if (param.type === "chat") {
                message = param.source_name
                    ? `[chat] <${param.source_name}> ${param.message}`
                    : `[chat] ${param.message}`;
            } else if (param.type === "raw") {
                message = `[raw] ${param.message}`;
            } else if (param.type === "translation") {
                message = `[translation] ${translation(param.parameters, param.message)}`;
            } else if (param.type === "whisper") {
                message = `[whisper] §o${translation([param.source_name, param.message], "commands.message.display.incoming")}`;
            } else if (param.type === "json") {
                message = `[json] ${renderJsonMessage(param)}`;
            } else if (param.type === "announcement") {
                message = `[announcement] ${param.message}`;
            } else {
                return;
            }
            console.log(time, s.mc(message));
            this.emit("message", message);
        });

        this.on("modal_form_request", (param) => {
            const form = new Form(this, param);
            if (this.currentForm && this.autoCloseForm) {
                console.log(s.mc(`[form] 表单未完成, 新的表单 ${form.title} (id:${form.id}) 已自动关闭`));
                form.busy();
            } else {
                this.currentForm = form;
                if (this.showForm) form.show();
                this.emit("form", this.currentForm);
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
                    this.queue("request_chunk_radius", { chunk_radius: this.viewDistance || 10 });
                }, 500);
            });
            // Send tick sync packets every 10 ticks
            const keepAliveInterval = 10;
            const keepAliveIntervalBig = BigInt(keepAliveInterval);
            let keepalive;
            this.tick = 0n;
            this.once("spawn", () => {
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
            `motd: \t${ad.motd}\n` +
            `version: \t${ad.version}\n` +
            `player: \t${ad.playersOnline}/${ad.playersMax}\n`;
        console.log(s.mc(message));
        super.connect();
        this.emit("connected");
    }

    async ping() {
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
                this.action(7);
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
