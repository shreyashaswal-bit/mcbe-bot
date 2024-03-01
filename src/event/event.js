const { FinishException } = require("../exception/finishException");

// @ts-ignore
class Event {
    isSuccess = true;
    constructor(callback = (new_data) => {}) {
        this._callback = callback;
    }

    reject() {
        this.isSuccess = false;
    }

    update(new_data) {
        this.newData = new_data;
    }

    finish() {
        throw new FinishException();
    }

    /**
     * 事件传递完毕后调用,返回事件是否成功
     * @returns {import("./event").EventFinally}
     */
    _finally() {
        if (this.isSuccess) {
            this._callback(this.newData);
        }
        return { eventSucceed: this.isSuccess, newData: this.newData };
    }
}

module.exports = { Event };
