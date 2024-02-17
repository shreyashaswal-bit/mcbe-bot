const properties = require('properties-parser');
const config = require('./config')

// 翻译索引
const parse = properties.parse(config.translation)

function format(msg) {
    return msg.replace(/%([a-zA-Z0-9_.]+)/g, (str, param) =>
        parse[param].replace(/\s*#\s*.*/g, '')
    )
}

/**
 * @param {string[]} parameters 
 * @param {string} message 
 * @return {string} 
 */
function translation(parameters, message) {
    return message.replace(/(?:%|^)([a-zA-Z0-9_.]+)/g, (str, param) => {
        let translatedMessage = parse[param].replace(/\s*#\s*.*/g, '');
        let i = 0
        return translatedMessage.replace(/%(?:([0-9])\$)?s/g, (str, param) =>
            format(param ? parameters[Number(param) - 1] : parameters[i++])
        )
    })
}

module.exports = { translation, format }