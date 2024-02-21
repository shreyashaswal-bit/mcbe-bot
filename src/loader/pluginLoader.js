const fs = require("fs");
const path = require("path");
const s = require("../util/consoleStyle");

const plugins = [];

function loadPlugin(plugin_path) {
    try {
        const plugin = require(plugin_path);
    } catch {
        console.log(s.mc(`[loader]§c failed load plugin ${plugin_path}`));
        return;
    }
    console.log(s.mc(`[loader]§a successfully loaded plugin ${plugin_path}`));
    plugins.push(plugin);
}

function loadPluginDir(plugin_dir) {
    console.log(`[loader] start load plugin dir: ${plugin_dir}`);
    fs.readdirSync(plugin_dir).forEach((file_name) => {
        if (/.*.js/.test(file_name)) loadPlugin(path.relative(__dirname, path.resolve(plugin_dir, file_name)));
    });
}

function startAllPlugin(context) {
    plugins.forEach((plugin) => {
        plugin(context);
    });
}

module.exports = { plugins, loadPlugin, loadPluginDir, startAllPlugin };
