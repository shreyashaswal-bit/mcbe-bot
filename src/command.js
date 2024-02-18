const { Command } = require("commander");
const { renderForm } = require("./form");
const { Vec3, BlockPosition } = require("./data");

const parser = new Command();
let bot = null;

parser.exitOverride((e) => {
    throw e;
});

parser
    .command("exit")
    .description("退出程序")
    .action(async () => {
        bot.close();
        process.exit(0);
    });

parser
    .command("form <mode> [args...]")
    .option("-o, --original")
    .addHelpText("after", "")
    .addHelpText("after", "e.g.:")
    .addHelpText("after", "  form response <按钮id|文本...>\t响应表单")
    .addHelpText("after", "  form exit [close|busy]\t\t关闭表单(默认为close)")
    .description("操作表单")
    .action(async (mode, args, options) => {
        const form = bot.currentForm;

        if (!form) {
            console.log("[form] 当前没有表单");
            return;
        }

        if (mode === "response" || mode === "r") {
            bot.currentForm = null;
            if (options.original) {
                form.response(JSON.parse(args.join(" ")));
            } else {
                if (form.type === "form") {
                    pressedButton = Number(args[0]);
                    form.response(pressedButton);
                } else if (form.type === "custom_form") {
                    let index = 0;
                    let resultArray = [];
                    for (let elem of form.content) {
                        if (elem.type === "input") {
                            resultArray.push(args[index]);
                            index++;
                        } else if (elem.type === "dropdown") {
                            resultArray.push(Number(args[index]));
                            index++;
                        } else {
                            resultArray.push(null);
                        }
                    }
                    form.response(resultArray);
                }
            }
        } else if (mode === "exit" || mode === "e") {
            bot.currentForm = null;
            if (!args || args[0] == "close") {
                form.close();
            } else if (args && args[0] == "busy") {
                form.busy();
            }
            console.log("[form] 表单已关闭");
        } else if (mode === "show" || mode === "s") {
            form.show();
        } else {
            console.error("error: mode错误");
        }
    });

parser
    .command("action <id> [position] [result_position] [face]")
    .addHelpText("after", "e.g.:")
    .addHelpText("after", "  action 0 123,45,678 \t\t开始破坏(123,45,678)处的方块")
    .addHelpText("after", '  action 2 "-123,45,678" \t停止破坏(123,45,678)处的方块')
    .addHelpText("after", "  action 21 \t\t\t\t开始游泳")
    .action(async (id_str, position_str, result_position_str, face_str) => {
        let rmQuot = (str) => str.replace(/^"|"$/g, "");
        let id = Number(id_str);
        let position = new BlockPosition(...rmQuot(position_str).split(","));
        let resultPosition = new BlockPosition(...rmQuot(result_position_str).split(","));
        let face = Number(face_str);
        bot.action(id, position, resultPosition, face);
    });

function parse(bot_, argv) {
    bot = bot_;
    try {
        parser.parse([null, null].concat(argv));
    } catch {}
}

module.exports = { parse };
