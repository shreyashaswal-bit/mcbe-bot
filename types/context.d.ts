import { Command } from "commander";

import { Bot } from "../src/bot";
import { Console } from "../src/console";
import { ListenerEx } from "../src/event/event";
import { Form } from "../src/mc/form";
import { Player } from "../src/mc/player";

import { Context } from "./context";
import { Config } from "./config";

export declare type Context = {
    bot: Bot;
    console: Console;
    parser: Command;
    config: Config;

    on(event_name: "player_join", callback: ListenerEx<Player>): Bot;
    on(event_name: "player_leave", callback: ListenerEx<Player>): Bot;
    on(event_name: "player_list_update", callback: ListenerEx<{ [uuid: string]: Player }>): Bot;
    on(event_name: "message", callback: ListenerEx<Text>): Bot;
    on(event_name: "form", callback: ListenerEx<Form>): Bot;
    on(event_name: string, callback: (...param: any) => void): Bot;

    once(event_name: "player_join", callback: ListenerEx<Player>): Bot;
    once(event_name: "player_leave", callback: ListenerEx<Player>): Bot;
    once(event_name: "player_list_update", callback: ListenerEx<{ [uuid: string]: Player }>): Bot;
    once(event_name: "message", callback: ListenerEx<Text>): Bot;
    once(event_name: "form", callback: ListenerEx<Form>): Bot;
    once(event_name: string, callback: (...param: any) => void): Bot;
};
