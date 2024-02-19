const fs = require("fs");
const path = require("path");

const plugins = [];

function loadPlugin(plugin_path) {
    const plugin = require(plugin_path);
    plugins.push(plugin);
}

function loadPluginDir(plugin_dir) {
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
