module.exports = {
    clear: "\e[0m",
    s: {
        normal: "\e[0m",
        blob: "\e[1m",
        vague: "\e[2m",
        italic: "\e[3m",
        underline: "\e[4m",
        blink: "\e[5m",
        fblink: "\e[6m",
        inverse: "\e[7m",
        hide: "\e[8m",
    },
    f: {
        gray: "\e[30m",
        red: "\e[31m",
        green: "\e[32m",
        yellow: "\e[33m",
        blue: "\e[34m",
        magenta: "\e[35m",
        cyan: "\e[36m",
        white: "\e[37m",
    },
    b: {
        gray: "\e[40m",
        red: "\e[41m",
        green: "\e[42m",
        yellow: "\e[43m",
        blue: "\e[44m",
        magenta: "\e[45m",
        cyan: "\e[46m",
        white: "\e[47m",
    },
    gray: "\e[30m",
    red: "\e[31m",
    green: "\e[32m",
    yellow: "\e[33m",
    blue: "\e[34m",
    magenta: "\e[35m",
    cyan: "\e[36m",
    white: "\e[37m",
    mc: (data) => {
        let str = ''
        if (data instanceof Array) str = data[0]
        else if (data instanceof String) str = data
        else { return }
        str.replace(/§[abcdefklor0-9]/, (str) => {
            return {
                "§0": "\e[0;30m",
                "§1": "\e[0;34m",
                "§2": "\e[0;32m",
                "§3": "\e[0;36m",
                "§4": "\e[0;31m",
                "§5": "\e[0;35m",
                "§6": "\e[0;33m",
                "§7": "\e[0;37m",
                "§8": "\e[0;90m",
                "§9": "\e[0;94m",
                "§a": "\e[0;92m",
                "§b": "\e[0;96m",
                "§c": "\e[0;91m",
                "§d": "\e[0;95m",
                "§e": "\e[0;93m",
                "§f": "\e[0;97m",
                "§k": "\e[8m",
                "§l": "\e[1m",
                "§o": "\e[3m",
                "§r": "\e[0m",
            }[str]
        })
        return str + this.clear
    }
}