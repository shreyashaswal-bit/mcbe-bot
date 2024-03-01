const { BaseException } = require("./baseException");

class FinishException extends BaseException {
    name = "FinishException";
    message = "Event Finished";
}

module.exports = { FinishException };
