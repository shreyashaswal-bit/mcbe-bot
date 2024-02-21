class Lock {
    callback = new Promise((resolve) => resolve());
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
