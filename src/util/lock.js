class Lock {
    callback = (value) => {};
    lock() {
        this.status = new Promise((resolve) => {
            this.callback = resolve;
        });
    }
    unlock() {
        this.callback();
    }
}

module.exports = { Lock };
