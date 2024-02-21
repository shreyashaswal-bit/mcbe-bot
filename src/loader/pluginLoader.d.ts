import { Context } from "../../types/context";

export let plugins: { [name: string]: (Context) => void };

export declare function loadPlugin(plugin_path: string): void;

export declare function loadPluginDir(plugin_dir: string): void;

export declare function startAllPlugin(context: Context): void;
