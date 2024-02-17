const { createBot } = require("./bot")
const { parse } = require("./command")
const { inputConsole } = require("./console")
const config = require("./config")

const bot = createBot(config.client)
inputConsole.start()
inputConsole.on("input", (input) => {
    if (input.startsWith("#")) {
        commandArg = input.slice(1, input.length).split(" ")
        parse(bot, commandArg)
    } else if (input.startsWith("/")) {
        bot.command(input)
    } else {
        bot.chat(input)
    }
})
