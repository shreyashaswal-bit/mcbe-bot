const s = require("./consoleStyle");

const form = null;

function renderForm(form_data) {
    let form = typeof form_data === "string" ? JSON.parse(form_data) : form_data;
    if (form.type == "form") {
        result = `${s.s.blob}===== ${form.title} =====${s.clear}\n` + `${form.content}\n` + `\n`;
        form.buttons.forEach((value, index) => {
            result += `  ${index}. ${value.text}\n`;
        });
        result += "\n";
    } else if (form.type === "custom_form") {
        result = `${s.s.blob}===== ${form.title} =====${s.clear}\n` + `\n`;
        form.content.forEach((value) => {
            if (value.type === "label") {
                result += `${value.text}\n`;
            } else if (value.type === "input") {
                result += `[ ${s.gray}${value.text}${s.clear} ]\n`;
            }
        });
        result += "\n";
    }
    return s.mc(result);
}

module.exports = { renderForm };
