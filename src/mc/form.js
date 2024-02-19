const s = require("../util/consoleStyle");

class Form {
    constructor(bot, { form_id, data }) {
        this.bot = bot;
        this.id = form_id;
        let formData = JSON.parse(data);
        this.type = formData.type;
        this.title = formData.title;
        this.content = formData.content;
        this.buttons = formData.buttons;
    }

    render() {
        let result = `${s.blue}===== ${s.clear}${s.s.blob}${this.title}${s.clear} ${s.blue}=====${s.clear}\n\n`;
        if (this.type == "form") {
            result += `${this.content}\n\n`;
            this.buttons.forEach((value, index) => {
                result += `  §e${index}.§r ${value.text}§r\n`;
            });
            result += "\n";
        } else if (this.type === "custom_form") {
            this.content.forEach((value) => {
                if (value.type === "label") {
                    result += `${value.text}\n`;
                } else if (value.type === "input") {
                    result += `§b[§r ${value.text} §b]§r\n`;
                } else if (value.type === "dropdown") {
                    result += `§b[ §a> §r${value.text} §b]§r\n`;
                    value.options.forEach((value, index) => {
                        result += `  §a- §e${index}.§r ${value}\n`;
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
