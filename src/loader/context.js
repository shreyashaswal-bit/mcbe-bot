class ContextImpl {
    constructor({ bot, console, parser, config }) {
        this.bot = bot;
        this.console = console;
        this.parser = parser;
        this.config = config;
    }

    on(event_name, callback) {
        return this.bot.on(event_name, callback);
    }

    once(event_name, callback) {
        return this.bot.once(event_name, callback);
    }
}

module.exports = { ContextImpl };
