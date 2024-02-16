const { createBot } = require("./bot")
const { parse } = require("./command")
const { consoleLoop } = require("./console")

const config = require("./config")

const bot = createBot(config.client)

consoleLoop((input) => {
    if (input.startsWith("#")) {
        commandArg = input.slice(1, input.length).split(" ")
        parse(commandArg)
    } else if (input.startsWith("/")) {
        bot.command(input)
    } else {
        bot.chat(input)
    }
})