const { Command } = require("commander")

parser = new Command()

parser.exitOverride((e) => {
    throw e
})

parser
    .command("exit")
    .action(async () => {
        process.exit(0)
    })

function parse(argv) {
    try {
        parser.parse([null, null].concat(argv),)
    }
    catch { }
}

module.exports = { parse }