import { Command } from "commander";
import { Context } from "./context";
import { Config } from "./config";
import { Bot, ExCallback } from "../src/bot";
import { Console } from "../src/console";
import { Form } from "../src/mc/form";
import { Player } from "../src/mc/player";

export declare type Context = {
    bot: Bot;
    console: Console;
    parser: Command;
    config: Config;

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
};
