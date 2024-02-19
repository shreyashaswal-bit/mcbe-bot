const assert = require("assert");

const bedrock = require("bedrock-protocol");
const auth = require("bedrock-protocol/src/client/auth");
const { ping } = require("bedrock-protocol/src/createClient");
const { sleep } = require("bedrock-protocol/src/datatypes/util");

const s = require("./util/consoleStyle");
const { renderForm, Form } = require("./mc/form");
const { translation } = require("./mc/text");
const { Vec3, BlockPosition } = require("./util/data");
const { processMessage } = require("./mc/text");
const { renderJsonMessage } = require("./mc/text");
const { Player } = require("./mc/player");

class Bot extends bedrock.Client {
    players = {};
    currentForm = null;

    constructor(config, { shuo_form = true, auto_close_form = true, auto_respawn = true }) {
        super(config);
        this.showForm = shuo_form;
        this.autoCloseForm = auto_close_form;
        this.auto_respawn = auto_respawn;

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
                message = `[whisper] §o${param.source_name} 悄悄对你说: ${param.message}§r`;
            } else if (param.type === "json") {
                message = `[json] ${renderJsonMessage(param)}`;
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

function createBot(client_config, bot_config) {
    assert(client_config);
    const bot = new Bot(
        { port: 19132, followPort: !client_config.realms, ...client_config, delayedInit: true },
        bot_config,
    );

    function onServerInfo() {
        bot.on("connect_allowed", () => connect(bot));
        if (client_config.skipPing) {
            bot.init();
        } else {
            ping(bot.options)
                .then((ad) => {
                    const adVersion = ad.version?.split(".").slice(0, 3).join("."); // Only 3 version units
                    bot.options.version =
                        client_config.version ?? (Options.Versions[adVersion] ? adVersion : Options.CURRENT_VERSION);

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

    if (client_config.realms) {
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
