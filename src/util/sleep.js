function sleep(time) {
    let callback;
    let promise = new Promise((resolve) => {
        callback = resolve;
    });
    setTimeout(callback, time);
    return promise;
}

module.exports = { sleep };
