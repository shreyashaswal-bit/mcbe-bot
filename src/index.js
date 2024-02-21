const { createBot } = require("./bot");
const { parse, parser } = require("./command");
const { inputConsole } = require("./console");
const { loadPluginDir, startAllPlugin } = require("./loader/pluginLoader");
const { ContextImpl } = require("./loader/context");
const config = require("./config");
const { Bot } = require("./bot");

const bot = new Bot(config.client, config.bot);
bot.connect();
bot.on("close", () => process.exit(1));
inputConsole.start();
inputConsole.on("input", (input) => {
    if (input.startsWith(".")) {
        commandArg = input.slice(1, input.length).split(" ");
        parse(bot, commandArg);
    } else if (input.startsWith("/")) {
        bot.command(input);
    } else {
        bot.chat(input);
    }
});

const context = new ContextImpl({ bot, console: inputConsole, parser });
loadPluginDir("./plugins");
startAllPlugin(context);
