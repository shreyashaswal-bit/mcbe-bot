import { Context } from "../../types/context";

type PluginCallback = (context: Context) => void;

export declare function createPlugin(callback: PluginCallback): PluginCallback;
