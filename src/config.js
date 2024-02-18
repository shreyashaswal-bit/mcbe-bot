const fs = require("fs");
const path = require("path");

module.exports = {
    client: {
        host: "mc.kanfeidie.com",
        port: 19132,
        version: "1.20.40",
        offline: false,
        profilesFolder: "./authdata",
    },
    get translation() {
        // 使用 getter 缓存以防止文件的重复读取
        return fs.readFileSync(path.join(__dirname, "../assets/zh_CN.lang"), "utf-8");
    },
};
