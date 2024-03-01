const { Event } = require("../event/event");
const { FinishException } = require("../exception/finishException");
// const { EventEmitter } = require("events");

function emitEx(emitter, event_name, param, succeed = (new_data) => {}) {
    let event = new Event(succeed);
    // emitter.emit(event_name, param, event);
    try {
        emitter.emit(event_name, param, event);
    } catch (error) {
        if (!(error instanceof FinishException)) {
            throw error;
        }
    }
    return event._finally();
}

module.exports = { emitEx };
