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
        show_form: true,
        auto_close_form: true,
        auto_respawn: true,
    },
    mc: {
        lang: "zh_CN",
    },
    program: {
        exit_when_bot_closed: true,
    },
};

const configEnv = process.env.BOT_ENV;

if (configEnv) {
    let newConfig = require(`../config/config.${configEnv}`);
    Object.entries(newConfig).forEach(([key, value]) => {
        config[key] = Object.assign(config[key], value);
    });
}

module.exports = config;
