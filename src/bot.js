const assert = require("assert");

const bedrock = require("bedrock-protocol");
const auth = require("bedrock-protocol/src/client/auth");
const { ping } = require("bedrock-protocol/src/createClient");
const { sleep } = require("bedrock-protocol/src/datatypes/util");

const s = require("./consoleStyle");
const { renderForm } = require("./form");
const { translation } = require("./translation");
const { Vec3, BlockPosition } = require("./data");

class Bot extends bedrock.Client {
    playerList = [];
    currentForm = null;

    autoCloseForm = true;
    autoRespawn = true;

    constructor(config) {
        super(config);

        this.on("player_list", (param) => {
            if (param.records.type == "add") {
                param.records.records.forEach((value) => {
                    for (let player of this.playerList) if (player.uuid == value.uuid) return;
                    this.playerList.push(value);
                });
            } else if (param.records.type == "remove") {
                this.playerList = this.playerList.filter((value) => {
                    for (let removedPlayer of param.records.records)
                        if (removedPlayer.uuid === value.uuid) return false;
                    return true;
                });
            }
            this.emit("player_list_update", this.playerList);
        });

        this.on("text", (param) => {
            let time = new Date().toLocaleString().substring(10);
            if (param.type === "chat") {
                if (param.source_name)
                    console.log(time, s.mc(`[chat] <${param.source_name}> ${param.message}${s.clear}`));
                else console.log(time, s.mc(`[chat] ${param.message}${s.clear}`));
            } else if (param.type === "raw") {
                console.log(time, s.mc(`[raw] ${param.message}${s.clear}`));
            } else if (param.type === "translation") {
                // 将消息内容翻译
                console.log(time, s.mc(`[translation] ${translation(param.parameters, param.message)}`));
            } else if (param.type === "whisper") {
                console.log(
                    time,
                    s.mc(`[whisper] ${s.s.italic}${param.source_name} 悄悄对你说: ${param.message}${s.clear}`),
                );
            }
        });

        this.on("modal_form_request", (param) => {
            if (this.currentForm && this.autoCloseForm) {
                console.log(s.mc(`[form] 表单未完成, 新的表单 ${param.data.title} (id:${param.form_id}) 已自动关闭`));
                this.cancelForm(param, 1); // busy
            } else {
                this.currentForm = param;
                console.log(renderForm(param.data));
            }
        });

        this.on("respawn", (param) => {
            if (this.autoRespawn) this.respawn(param);
        });
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

    action(id, position, result_position, face) {
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
                this.action(7, new BlockPosition(), new BlockPosition(), -1);
                break;
        }
    }

    responseForm(param, data) {
        this.write("modal_form_response", {
            form_id: param.form_id,
            has_response_data: true,
            data: JSON.stringify(data),
            has_cancel_reason: false,
        });
    }

    cancelForm(param, reason) {
        this.write("modal_form_response", {
            form_id: param.form_id,
            has_response_data: false,
            has_cancel_reason: true,
            cancel_reason: reason,
        });
    }
}

function createBot(options) {
    assert(options);
    const bot = new Bot({ port: 19132, followPort: !options.realms, ...options, delayedInit: true });

    function onServerInfo() {
        bot.on("connect_allowed", () => connect(bot));
        if (options.skipPing) {
            bot.init();
        } else {
            ping(bot.options)
                .then((ad) => {
                    const adVersion = ad.version?.split(".").slice(0, 3).join("."); // Only 3 version units
                    bot.options.version =
                        options.version ?? (Options.Versions[adVersion] ? adVersion : Options.CURRENT_VERSION);

                    if (ad.portV4 && bot.options.followPort) {
                        bot.options.port = ad.portV4;
                    }

                    bot.conLog?.(
                        `Connecting to ${bot.options.host}:${bot.options.port} ${ad.motd} (${ad.levelName}), version ${ad.version} ${bot.options.version !== ad.version ? ` (as ${bot.options.version})` : ""}`,
                    );
                    bot.init();
                })
                .catch((e) => bot.emit("error", e));
        }
    }

    if (options.realms) {
        auth.realmAuthenticate(bot.options)
            .then(onServerInfo)
            .catch((e) => bot.emit("error", e));
    } else {
        onServerInfo();
    }
    return bot;
}

function connect(client) {
    // Actually connect
    client.connect();

    client.once("resource_packs_info", (packet) => {
        client.write("resource_pack_client_response", {
            response_status: "completed",
            resourcepackids: [],
        });

        client.once("resource_pack_stack", (stack) => {
            client.write("resource_pack_client_response", {
                response_status: "completed",
                resourcepackids: [],
            });
        });

        client.queue("client_cache_status", { enabled: false });
        client.queue("tick_sync", { request_time: BigInt(Date.now()), response_time: 0n });
        sleep(500).then(() => client.queue("request_chunk_radius", { chunk_radius: client.viewDistance || 10 }));
    });

    // Send tick sync packets every 10 ticks
    const keepAliveInterval = 10;
    const keepAliveIntervalBig = BigInt(keepAliveInterval);
    let keepalive;
    client.tick = 0n;
    client.once("spawn", () => {
        keepalive = setInterval(() => {
            // Client fills out the request_time and the server does response_time in its reply.
            client.queue("tick_sync", { request_time: client.tick, response_time: 0n });
            client.tick += keepAliveIntervalBig;
        }, 50 * keepAliveInterval);

        client.on("tick_sync", async (packet) => {
            client.emit("heartbeat", packet.response_time);
            client.tick = packet.response_time;
        });
    });

    client.once("close", () => {
        clearInterval(keepalive);
    });
}

module.exports = { Bot, createBot };
