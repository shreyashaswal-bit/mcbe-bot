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
    return message.replace(/(?:%|^)([a-zA-Z0-9_.]+)/g, (str, param) => {
        let translatedMessage = parse[param].replace(/\s*#\s*.*/g, '');
        return translatedMessage.replace(/%(?:([0-9])\$)?s/g, (str, param) =>
            param ? parameters[Number(param) - 1] : parameters[0]
        )
    })
}

module.exports = { translation }