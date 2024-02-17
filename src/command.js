const { Command } = require("commander")
const { renderForm } = require("./form")

const parser = new Command()
let bot = null

parser.exitOverride((e) => {
    throw e
})

parser
    .command("exit")
    .description("退出程序")
    .action(async () => {
        bot.close()
        process.exit(0)
    })

parser
    .command("form <mode> [args...]")
    .addHelpText("after", "")
    .addHelpText("after", "e.g.:")
    .addHelpText("after", "  form response <按钮id|文本...>\t响应表单")
    .addHelpText("after", "  form exit [close|busy]\t\t关闭表单(默认为close)")
    .description("操作表单")
    .action(async (mode, args) => {
        const form = bot.currentForm
        const form_data = form && JSON.parse(form.data)

        if (!form) {
            console.log("[form] 当前没有表单")
            return
        }

        if (mode === "response" || mode === "r") {
            bot.currentForm = null
            if (form_data.type === "form") {
                pressedButton = Number(args[0])
                bot.responseForm(form, pressedButton)
            } else if (form_data.type === "custom_form") {
                let index = 0
                let resultArray = []
                for (let elem of form_data.content) {
                    if (elem.type === "input") {
                        resultArray.push(args[index])
                        index++
                    } else {
                        resultArray.push(null)
                    }
                }
                bot.responseForm(form, resultArray)
            }
        } else if (mode === "exit" || mode === "e") {
            bot.currentForm = null
            if (!args || (args || args[0] == "close")) {
                bot.cancelForm(form, 1)
            }
            else if (args && args[0] == "busy") {
                bot.cancelForm(form, 0)
            }
        } else if (mode === "show" || mode === "s") {
            console.log(renderForm(form_data))
        }
        else {
            console.error("不存在的mode")
        }
    })

parser
    .command("action <id> [position] [result_position] [face]")
    .addHelpText("after", "e.g.:")
    .addHelpText("after", "  action 0 123,45,678 \t破坏123,45,678处的方块")
    .addHelpText("after", "  action 21\t\t开始游泳")
    .action(async (id, position_str = "0,0,0", result_position_str = "0,0,0", face_str = "0") => {
        let temp = position_str.split(",")
        let position = { x: Number(temp[0]), y: Number(temp[1]), z: Number(temp[2]) }
        temp = result_position_str.split(",")
        let resultPosition = { x: Number(temp[0]), y: Number(temp[1]), z: Number(temp[2]) }
        let face = Number(face_str)
        bot.action(Number(id), position, resultPosition, face)
    })

parser
    .command("respawn")
    .action(async () => {
        bot.respawn()
    })

parser
    .command("tp <position>")
    .action(async (position_str) => {
        let temp = position_str.split(",")
        let position = {
            x: Number(temp[0]),
            y: Number(temp[1]),
            z: Number(temp[2]),
        }
        console.log(position)
        bot.write("move_player", {
            runtime_id: String(bot.entityId),
            position: position,
            pitch: 0,
            yaw: 0,
            head_yaw: 0,
            mode: 0,
            on_ground: true,
            ridden_runtime_id: 0,
            tick: 10,
        })
    })

parser
    .command("action <id> [position] [result_position] [face]")
    .addHelpText("after", "e.g.:")
    .addHelpText("after", "  action 0 123,45,678 \t破坏123,45,678处的方块")
    .addHelpText("after", "  action 21\t\t\t开始游泳")
    .action(async (id, position_str = "0,0,0", result_position_str = "0,0,0", face_str = "0") => {
        let temp = position_str.split(",")
        let position = { x: temp[0], y: temp[1], z: temp[2] }
        temp = result_position_str.split(",")
        let resultPosition = { x: temp[0], y: temp[1], z: temp[2] }
        let face = Number(face_str)
        bot.action(Number(id), position, resultPosition, face)
    })

parser
    .command("respawn")
    .action(async () => {
        bot.respawn()
    })

function parse(bot_, argv) {
    bot = bot_
    try {
        parser.parse([null, null].concat(argv))
    }
    catch { }
}

module.exports = { parse }