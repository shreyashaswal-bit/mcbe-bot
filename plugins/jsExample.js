const s = require("../src/util/consoleStyle");

module.exports = ({ parser }) => {
    console.log(s.mc`§eHello World!`);
    parser.command("hello-js").action(async () => {
        console.log(s.mc`§eHello JS!`);
    });
};
