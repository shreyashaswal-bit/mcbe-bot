/**
 * 翻译
 * @param {string} message
 * @returns {string}
 */
export declare function translate(message: string): string;

/**
 * 格式化消息
 * @param {string[]} parameters
 * @param {string} message
 * @returns {string}
 */
export declare function formatMessage(parameters: string[]): string;

/**
 * 翻译并格式translation消息
 * @param {string[]} parameters
 * @param {string} message
 * @returns {string}
 */
export declare function translation(parameters: string[], message: string): string;

/**
 * 渲染基础聊天对象
 * @param {string} base_text
 * @returns {string}
 */
export declare function renderBaseText(base_text: object): string;

/**
 * 渲染rawText
 * @param {string} raw_text
 * @returns string
 */
export declare function renderRawText(raw_text: object): string;

/**
 * 渲染json消息
 * @param {object} data
 * @returns
 */
export declare function renderJsonMessage(data: object): string;
