const { createPlugin } = require("../src/util/createPlugin");
const s = require("../src/util/consoleStyle");

module.exports = createPlugin(({ parser }) => {
    console.log(s.mc`§eHello World!`);
    parser.command("hello-js").action(async () => {
        console.log(s.mc`§eHello JS!`);
    });
});
