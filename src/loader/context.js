class ContextImpl {
    constructor({ bot, console, parser }) {
        this.bot = bot;
        this.console = console;
        this.parser = parser;
    }

    on(event_name, callback) {
        return this.bot.on(event_name, callback);
    }
}

module.exports = { ContextImpl };
