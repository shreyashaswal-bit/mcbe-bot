const fs = require("fs");
const path = require("path");

const properties = require("properties-parser");
const config = require("../config");

const translateFile = fs.readFileSync(path.join("./assets", `${config.mc.lang}.lang`));
// 翻译索引
const parse = properties.parse(translateFile.toString());

class Text {
    constructor(param) {
        this.type = param.type;
        this.message = param.message;
        this.parameters = param.parameters;
        this.sourceName = param.source_name;
        this.needsTranslation = param.needs_translation;
    }

    render() {
        if (this.type === "chat") {
            return this.message;
        } else if (this.type === "raw") {
            return this.message;
        } else if (this.type === "announcement") {
            return this.message;
        } else if (this.type === "translation") {
            return this.renderAsTranslateMessage();
        } else if (this.type === "json") {
            return this.renderAsJsonMessage();
        } else if (this.type === "whisper") {
            return format(translate("commands.message.display.incoming"), [this.sourceName, this.message]);
        } else {
            return;
        }
    }

    /**
     * 以普通消息格式渲染消息
     * @returns {string}
     */
    renderAsNormalMessage() {
        return this.message;
    }

    /**
     * 以 Translation 消息格式渲染消息
     * @returns {string}
     */
    renderAsTranslateMessage() {
        return translate(format(translate(this.message), this.parameters));
    }

    /**
     * 以 Json 消息格式渲染消息
     * @returns {string}
     */
    renderAsJsonMessage() {
        let rawText = JSON.parse(this.message);
        let result = renderRawText(rawText);
        if (this.needsTranslation) {
            result = translate(format(translate(result), this.parameters));
        }
        return result;
    }
}

/**
 * 输入翻译键, 如果存在翻译则返回翻译结果, 否则返回翻译键字符串
 * @param {string} key
 * @returns {string}
 */
function getTranslation(key) {
    return parse[key] ? parse[key].replace(/\s*#.*/g, "") : key;
}

/**
 * 翻译含有 “%(翻译键)” 或者直接为翻译键的消息, 返回翻译后字符串
 * @param {string} message
 * @returns {string}
 */
function translate(message) {
    return message.replace(/(?:^|%)([a-zA-Z0-9_.]+)/g, (str, param) => getTranslation(param));
}

/**
 * 格式化含有 “%s” 或 “%(数字)$s” 的字符串, 返回格式化后字符串
 * @param {string} message
 * @param {string[]} parameters
 * @returns
 */
function format(message, parameters) {
    let i = 0;
    return message.replace(/%(?:([0-9])\$)?s/g, (str, param) =>
        param ? parameters[Number(param) - 1] : parameters[i++],
    );
}

/**
 * 渲染 BaseText(基础聊天对象)
 * @param {string|import("../../types/text").BaseText} base_text
 * @returns {string|void}
 */
function renderBaseText(base_text) {
    if (typeof base_text == "string") {
        // 是字符串类型,直接返回
        return base_text;
    } else if (base_text.text) {
        // 文本类型, 直接返回文本
        return base_text.text;
    } else if (base_text.translate) {
        // 翻译类型, 翻译文本
        let translateResult = translate(base_text.translate);

        if (base_text.with && base_text.with instanceof Array) {
            // with 是 string[] 类型, 直接格式化
            return format(translateResult, base_text.with);
        } else if (base_text.with && base_text.with.rawtext) {
            // with 是 RawText 类型, 逐个渲染
            let withList = [];
            base_text.with.rawtext.forEach((value) => {
                withList.push(renderBaseText(value));
            });
            // 渲染完成, 执行格式化
            return translate(format(translateResult, withList));
        }
        return translateResult;
    }
}

/**
 * 渲染 RawText
 * @param {import("../../types/text").RawText} raw_text
 * @returns {string}
 */
function renderRawText(raw_text) {
    let result = "";
    for (let baseText of raw_text.rawtext) {
        result += renderBaseText(baseText);
    }
    return result;
}

module.exports = { Text, getTranslation, translate, format, renderBaseText, renderRawText };
