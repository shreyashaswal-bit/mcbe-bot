const { loadPluginDir, startAllPlugin } = require("./loader/pluginLoader");
const { ContextImpl } = require("./loader/context");
const config = require("./config");
const { parse, parser } = require("./command");
const { inputConsole } = require("./console");
const { Bot } = require("./bot");

const bot = new Bot(config.client, config.bot);
const context = new ContextImpl({ bot, console: inputConsole, parser, config });

bot.connect();
bot.on("close", () => {
    console.log("[system] bot closed!");
    if (config.program.exit_when_bot_closed) {
        process.exit(1);
    }
});

inputConsole.start();
inputConsole.on("input", (input) => {
    if (input.startsWith(".")) {
        const commandArg = input.slice(1).split(" ");
        parse(context, commandArg);
    } else if (input.startsWith("/")) {
        bot.command(input);
    } else {
        bot.chat(input);
    }
});

loadPluginDir("./plugins");
startAllPlugin(context);
