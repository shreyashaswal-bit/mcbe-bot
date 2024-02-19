import { Command } from "commander";
import { Bot } from "../src/bot";
import { Console } from "../src/console";
import { Form } from "../src/mc/form";
import { Player } from "bedrock-protocol";

export declare type Context = {
    bot: Bot;
    console: Console;
    parser: Command;

    on(event_name: "player_list_update", callback: (player_list: Player[]) => void): Bot;
    on(event_name: "message", callback: (message: string) => void): Bot;
    on(event_name: "form", callback: (form: Form) => void): Bot;
    on(event_name: any, callback: (data: any) => void): Bot;
};
