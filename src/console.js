const readline = require('readline');

const { Lock } = require("./lock")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function consoleLoop(callback) {
    const lock = new Lock()
    while (true) {
        lock.lock()
        rl.question('', (input) => {
            callback(input)
            lock.unlock()
        })
        await lock.status
    }
}

module.exports = { consoleLoop }