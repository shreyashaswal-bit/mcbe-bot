class ContextImpl {
    constructor({ bot, console, parser }) {
        this.bot = bot;
        this.console = console;
        this.parser = parser;
    }

    on(...args) {
        return this.bot.on(...args);
    }
}

module.exports = { ContextImpl };
