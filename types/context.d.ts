import { Command } from "commander";
import { Context } from "./context";
import { Config } from "./config";
import { Bot } from "../src/bot";
import { Console } from "../src/console";
import { Form } from "../src/mc/form";
import { Player } from "../src/mc/player";

export declare type Context = {
    bot: Bot;
    console: Console;
    parser: Command;
    config: Confog;

    on(event_name: "player_join", callback: (player: Player) => void): Bot;
    on(event_name: "player_leave", callback: (player: Player) => void): Bot;
    on(event_name: "player_list_update", callback: (player_list: { [uuid: string]: Player }) => void): Bot;
    on(event_name: "message", callback: (message: string) => void): Bot;
    on(event_name: "form", callback: (form: Form) => void): Bot;
    on(event_name: string, callback: (data: any) => void): Bot;

    once(event_name: "player_join", callback: (player: Player) => void): Bot;
    once(event_name: "player_leave", callback: (player: Player) => void): Bot;
    once(event_name: "player_list_update", callback: (player_list: { [uuid: string]: Player }) => void): Bot;
    once(event_name: "message", callback: (message: string) => void): Bot;
    once(event_name: "form", callback: (form: Form) => void): Bot;
    once(event_name: string, callback: (data: any) => void): Bot;
};
