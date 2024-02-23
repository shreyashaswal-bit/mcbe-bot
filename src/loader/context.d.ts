import { Command } from "commander";
import { Context } from "../../types/context";
import { Config } from "../../types/config";
import { Bot } from "../bot";
import { Console } from "../console";
import { Form } from "../mc/form";
import { Player } from "../mc/player";

export class ContextImpl implements Context {
    bot: Bot;
    console: Console;
    parser: Command;
    config: Config;

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
}
