import { Command } from "commander";

import { Context } from "../../types/context";
import { Config } from "../../types/config";
import { Form } from "../mc/form";
import { Player } from "../mc/player";
import { Bot, ExCallback } from "../bot";
import { Console } from "../console";

export class ContextImpl implements Context {
    bot: Bot;
    console: Console;
    parser: Command;
    config: Config;

    constructor(param: { bot: Bot; console: Console; parser: Command; config: Config });

    on(event_name: "player_join", callback: ExCallback<Player>): Bot;
    on(event_name: "player_leave", callback: ExCallback<Player>): Bot;
    on(event_name: "player_list_update", callback: ExCallback<{ [uuid: string]: Player }>): Bot;
    on(event_name: "message", callback: ExCallback<Text>): Bot;
    on(event_name: "form", callback: ExCallback<Form>): Bot;
    on(event_name: string, callback: (...param: any) => void): Bot;

    once(event_name: "player_join", callback: ExCallback<Player>): Bot;
    once(event_name: "player_leave", callback: ExCallback<Player>): Bot;
    once(event_name: "player_list_update", callback: ExCallback<{ [uuid: string]: Player }>): Bot;
    once(event_name: "message", callback: ExCallback<Text>): Bot;
    once(event_name: "form", callback: ExCallback<Form>): Bot;
    once(event_name: string, callback: (...param: any) => void): Bot;
}
