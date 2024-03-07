import { BaseText, JsonMessage, Message, RawText, TranslationMessage } from "../../types/text";

declare const enum MessageType {
    CHAT = "chat",
    RAW = "raw",
    ANNOUNCEMENT = "announcement",
    TRANSLATION = "translation",
    JSON = "json",
    WHISPER = "whisper",
    JUKEBOX_POPUP = "jukebox_popup",
    // TODO: 完善类型
}
export declare class Text {
    type: MessageType;
    message: string;
    parameters: void | string[];
    sourceName: void | string;
    needsTranslation: void | boolean;

    constructor(param: Message | TranslationMessage | JsonMessage);

    render(): string;

    /**
     * 以普通消息格式渲染消息
     * @returns {string}
     */
    renderAsNormalMessage(): string;

    /**
     * 以 Translation 消息格式渲染消息
     * @returns {string}
     */
    renderAsTranslateMessage(): string;

    /**
     * 以 Json 消息格式渲染消息
     * @returns {string}
     */
    renderAsJsonMessage(): string;
}

/**
 * 输入翻译键, 如果存在翻译则返回翻译结果, 否则返回翻译键字符串
 * @param {string} key
 * @returns {string}
 */
export declare function getTranslation(key): string;
/**
 * 翻译含有 “%(翻译键)” 或者直接为翻译键的消息, 返回翻译后字符串
 * @param {string} message
 * @returns {string}
 */
export declare function translate(message): string;

/**
 * 格式化含有 “%s” 或 “%(数字)$s” 的字符串, 返回格式化后字符串
 * @param {string} message
 * @param {string[]} parameters
 * @returns
 */
export declare function format(message, parameters): string;

/**
 * 渲染 BaseText(基础聊天对象)
 * @param {string|import("../../types/text").BaseText} base_text
 * @returns {string|void}
 */
export declare function renderBaseText(base_text): string;

/**
 * 渲染 RawText
 * @param {import("../../types/text").RawText} raw_text
 * @returns {string}
 */
export declare function renderRawText(raw_text): string;
