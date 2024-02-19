class Lock {
    callback = null;
    status = null;
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
