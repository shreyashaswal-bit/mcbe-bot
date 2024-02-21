const fs = require("fs");
const path = require("path");

const properties = require("properties-parser");
const config = require("../config");

const translateFile = fs.readFileSync(path.join("./assets", `${config.mc.lang}.lang`));
// 翻译索引
const parse = properties.parse(translateFile);

/**
 * 翻译
 * @param {string} message
 * @returns {string}
 */
function translate(message) {
    return message.replace(/(?:^|%)([a-zA-Z0-9_.]+)/g, (str, param) =>
        parse[param] ? parse[param].replace(/\s*#.*/g, "") : param,
    );
}

/**
 * 格式化消息
 * @param {string[]} parameters
 * @param {string} message
 * @returns {string}
 */
function formatMessage(parameters, message) {
    let i = 0;
    return message.replace(/%(?:([0-9])\$)?s/g, (str, param) =>
        translate(param ? parameters[Number(param) - 1] : parameters[i++]),
    );
}

/**
 * 翻译并格式translation消息
 * @param {string[]} parameters
 * @param {string} message
 * @returns {string}
 */
function translation(parameters, message) {
    return formatMessage(parameters, translate(message));
}

/**
 * 渲染基础聊天对象
 * @param {string} base_text
 * @returns {string}
 */
function renderBaseText(base_text) {
    if (base_text.text) {
        return base_text.text;
    } else if (base_text.translate) {
        let translateResult = translate(base_text.translate);
        if (base_text.with && base_text.with instanceof Array) {
            return formatMessage(base_text.with, translateResult);
        } else if (base_text.with && base_text.with.rawtext) {
            let withList = [];
            base_text.with.rawtext.forEach((value) => {
                withList.push(renderBaseText(value));
            });
            return formatMessage(withList, translateResult);
        }
        return translateResult;
    }
}

/**
 * 渲染rawText
 * @param {string} raw_text
 * @returns {string}
 */
function renderRawText(raw_text) {
    let result = "";
    for (let baseText of raw_text.rawtext) {
        result += renderBaseText(baseText);
    }
    return result;
}

/**
 * 渲染json消息
 * @param {object} data
 * @returns {string}
 */
function renderJsonMessage(data) {
    let rawText = JSON.parse(data.message);
    let result = renderRawText(rawText);
    if (data.needs_translation) {
        result = translation(data.parameters, result);
    }
    return result;
}

module.exports = { translate, formatMessage, translation, renderBaseText, renderBaseText, renderJsonMessage };
