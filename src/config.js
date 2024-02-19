const fs = require("fs");
const path = require("path");

let config = {
    client: {
        host: "mc.kanfeidie.com",
        port: 19132,
        version: "1.20.40",
        offline: false,
        profilesFolder: "./authdata",
    },
    bot: {
        shuo_form: true,
        auto_close_form: true,
        auto_respawn: true,
    },
    mc: {
        lang: "zh_CN",
    },
};

const configEnv = process.env.BOT_ENV;

if (configEnv) {
    let { client, bot, mc } = require(`../config/config.${configEnv}`);
    client = Object.assign(config.client, client);
    bot = Object.assign(config.bot, bot);
    mc = Object.assign(config.mc, mc);
    config = { client, bot, mc };
}

module.exports = config;
