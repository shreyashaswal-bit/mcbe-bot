const s = require("../util/consoleStyle");

class Form {
    constructor(bot, param) {
        this.bot = bot;
        this.id = param.form_id;
        let data = JSON.parse(param.data);
        this.type = data.type;
        this.title = data.title;
        this.content = data.content;
        this.buttons = data.buttons;
    }

    render() {
        let result = `${s.blue}===== ${s.clear}${s.s.blob}${this.title}${s.clear} ${s.blue}=====${s.clear}\n\n`;
        if (this.type == "form") {
            result += `${this.content}\n\n`;
            this.buttons.forEach((value, index) => {
                result += `  ${s.yellow}${index}. ${s.gray}${value.text}${s.clear}\n`;
            });
            result += "\n";
        } else if (this.type === "custom_form") {
            this.content.forEach((value) => {
                if (value.type === "label") {
                    result += `${value.text}\n`;
                } else if (value.type === "input") {
                    result += `${s.blue}[${s.clear} ${value.text} ${s.blue}]${s.clear}\n`;
                } else if (value.type === "dropdown") {
                    result += `${s.blue}[ ${s.green}> ${s.clear}${value.text} ${s.blue}]${s.clear}\n`;
                    value.options.forEach((value, index) => {
                        result += `  ${s.green}- ${s.yellow}${index}. ${s.gray}${value}${s.clear}\n`;
                    });
                    result += "\n";
                }
            });
            result += "\n";
        }
        return result;
    }

    show() {
        console.log(s.mc(this.render()));
    }

    response(data) {
        this.bot.responseForm(this.id, data);
    }

    close() {
        this.bot.cancelForm(this.id, 0);
    }

    busy() {
        this.bot.cancelForm(this.id, 1);
    }
}

module.exports = { Form };
