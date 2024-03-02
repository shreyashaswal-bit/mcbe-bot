const { Command, CommanderError } = require("commander");

const { BlockPosition } = require("./util/data");
const { Bot } = require("./bot");

/**
 * @type {Bot}
 */
let bot;

function rmQuot(str) {
    return str.replace(/^"|"$/g, "");
}

const parser = new Command();

parser.exitOverride((e) => {
    // 输入指令后 Commander 将退出程序
    // 此处重定向退出方法, 将要退出时抛出错误阻止退出
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
    .addHelpText("after", "  form response <按钮id|文本...>\t响应表单.")
    .addHelpText("after", "  form exit [close|busy]\t\t关闭表单(默认为close).")
    .addHelpText("after", "  form show\t\t\t\t再次展示表单.")
    .description("操作表单")
    .action(async (mode, args, options) => {
        const form = bot.currentForm;

        // 没有表单, 直接退出
        if (!form) {
            console.log("[form] 当前没有表单");
            return;
        }

        if (mode === "response" || mode === "r") {
            // 回复表单模式

            // 清空暂存的表单
            bot.currentForm = undefined;

            // 是否含有 “--original” 选项, 如果有, 则拼接所有其他参数并用JSON编码
            if (options.original) {
                form.response(JSON.parse(args.join(" ")));
                return;
            }

            // 判断表单类型
            switch (form.type) {
                case "form":
                    const pressedButton = Number(args[0]);
                    form.response(pressedButton);
                    break;
                case "custom_form":
                    if (typeof form.content == "string") return;
                    let index = 0;
                    let resultArray = [];
                    // 遍历 content, 解析输入
                    for (let elem of form.content) {
                        switch (elem.type) {
                            case "input":
                                resultArray.push(rmQuot(args[index]));
                                index++;
                                break;
                            case "dropdown":
                                resultArray.push(Number(args[index]));
                                index++;
                                break;
                            default:
                                resultArray.push(null);
                        }
                    }
                    form.response(resultArray);
            }
        } else if (mode === "exit" || mode === "e") {
            // 关闭表单模式
            bot.currentForm = undefined;

            // 获取参数, 判断关闭类
            if (!args || args[0] == "close") {
                form.close();
            } else if (args && args[0] == "busy") {
                form.busy();
            }

            console.log("[form] 表单已关闭");
        } else if (mode === "show" || mode === "s") {
            // 渲染表单模式
            form.show();
        } else {
            // 错误的模式
            console.error("error: mode错误");
        }
    });

parser
    .command("action <id> [position] [result_position] [face]")
    .addHelpText("after", "")
    .addHelpText("after", "e.g.:")
    .addHelpText("after", "  action 0 123,45,678 \t\t开始破坏(123,45,678)处的方块.")
    .addHelpText("after", '  action 2 "-123,45,678" \t停止破坏(123,45,678)处的方块.')
    .addHelpText("after", "  action 21 \t\t\t\t开始游泳.")
    .action(async (id_str, position_str, result_position_str, face_str) => {
        let id = Number(id_str);

        let positionArgs = rmQuot(position_str)
            .split(",")
            .map((value) => Number(value));
        let position = new BlockPosition(...positionArgs);

        let resultPositionArgs = rmQuot(result_position_str)
            .split(",")
            .map((value) => Number(value));
        let resultPosition = new BlockPosition(...resultPositionArgs);

        let face = Number(face_str);

        bot.action(id, { position, resultPosition, face });
    });

function parse(bot_temp, argv) {
    bot = bot_temp;

    // 由于已经重定向退出方法, 调用 parse 会抛出错误, 这里捕获错误
    try {
        parser.parse(["", "", ...argv]);
    } catch (err) {
        // 如果错误不由 Commander 抛出, 则再次抛出错误
        if (!(err instanceof CommanderError)) throw err;
    }
}

module.exports = { parser, parse };
