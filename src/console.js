const readline = require("readline");
const { EventEmitter } = require("events");

const { Lock } = require("./util/lock");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

class Console extends EventEmitter {
    async start() {
        const lock = new Lock();
        while (true) {
            lock.lock();
            rl.question("", (input) => {
                this.emit("input", input);
                console.log("->", input);
                lock.unlock();
            });
            await lock.status;
        }
    }
}

const inputConsole = new Console();

module.exports = { Console, inputConsole };
