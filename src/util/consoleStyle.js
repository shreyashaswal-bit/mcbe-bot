module.exports = {
    clear: "\x1b[0m",
    s: {
        normal: "\x1b[0m",
        blob: "\x1b[1m",
        vague: "\x1b[2m",
        italic: "\x1b[3m",
        underline: "\x1b[4m",
        blink: "\x1b[5m",
        fblink: "\x1b[6m",
        inverse: "\x1b[7m",
        hide: "\x1b[8m",
    },
    f: {
        gray: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
    },
    b: {
        gray: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m",
    },
    gray: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    mc: (data) => {
        let tempStr = "";
        if (data instanceof Array) tempStr = data[0];
        else if (typeof data === "string") tempStr = data;
        else {
            return;
        }
        let result = tempStr.replace(/§[abcdefklor0-9]/g, (str) => {
            return {
                "§0": "\x1b[0;30m",
                "§1": "\x1b[0;34m",
                "§2": "\x1b[0;32m",
                "§3": "\x1b[0;36m",
                "§4": "\x1b[0;31m",
                "§5": "\x1b[0;35m",
                "§6": "\x1b[0;33m",
                "§7": "\x1b[0;37m",
                "§8": "\x1b[0;90m",
                "§9": "\x1b[0;94m",
                "§a": "\x1b[0;92m",
                "§b": "\x1b[0;96m",
                "§c": "\x1b[0;91m",
                "§d": "\x1b[0;95m",
                "§e": "\x1b[0;93m",
                "§f": "\x1b[0;97m",
                "§k": "\x1b[8m",
                "§l": "\x1b[1m",
                "§o": "\x1b[3m",
                "§r": "\x1b[0m",
            }[str];
        });
        return result + "\x1b[0m";
    },
};
