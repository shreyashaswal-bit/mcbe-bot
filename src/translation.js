const properties = require('properties-parser');
const config = require('./config')

// 翻译索引
const parse = properties.parse(config.translation)

/**
 * @param {string[]} parameters 
 * @param {string} message 
 * @return {string} 
 */
function translation(parameters, message) {
    
    // 过滤颜色符号
    message = message.replace(/§[abcdefklor0-9]%/g, '');

    // 遍历翻译parameters
    const list = parameters.map((value) => value = parse[value] || value);
    
    // 消息的翻译是否存在
    if (parse[message]) {
        // 判断消息是不是和multiplayer有关, 有的话就加黄色
        if (message.includes('multiplayer')) {
            message = parse[message] || message;
        } else {
            message = parse[message] || message;
            message = '§e' + message
        }

        // 获取对应的翻译后, 将翻译作为模板套parameters
        list.forEach((value, index) => {
            message = message
                .replace(`%${index + 1}$s`, value)
                .replace(`%s`, value);
        });
        return message.replace(/\s*#.*$/, '');
    } else {
        return `${list.join(', ')} ${message.includes('multiplayer') ? '§e' + message : message}`;
    }
}

module.exports = { translation }