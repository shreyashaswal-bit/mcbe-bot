const s = require("./consoleStyle");

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
        let result = "";
        if (this.type == "form") {
            result = `${s.s.blob}===== ${this.title} =====${s.clear}\n` + `${this.content}\n` + `\n`;
            this.buttons.forEach((value, index) => {
                result += `  ${index}. ${value.text}\n`;
            });
            result += "\n";
        } else if (this.type === "custom_form") {
            result = `${s.s.blob}===== ${this.title} =====${s.clear}\n` + `\n`;
            this.content.forEach((value) => {
                if (value.type === "label") {
                    result += `${value.text}\n`;
                } else if (value.type === "input") {
                    result += `[ ${s.gray}${value.text}${s.clear} ]\n`;
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
