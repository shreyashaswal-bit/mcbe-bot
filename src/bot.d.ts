import { Client } from "bedrock-protocol";

import { Player } from "../types/player";
import { StartGameData } from "../types/startGameData";
import { BotConfig, ClientConfig } from "../types/config";
import { BlockPosition } from "./util/data";
import { Event, ListenerEx } from "./event/event";
import { Form } from "./mc/form";

export declare class Bot extends Client {
    players: { [uuid: string]: Player };
    currentForm: undefined | Form;

    showForm: boolean;
    autoCloseForm: boolean;
    autoRespawn: boolean;

    constructor(config: ClientConfig, param: BotConfig);

    on(event_name: "player_join", callback: ListenerEx<Player>): this;
    on(event_name: "player_leave", callback: ListenerEx<Player>): this;
    on(event_name: "player_list_update", callback: ListenerEx<{ [uuid: string]: Player }>): this;
    on(event_name: "message", callback: ListenerEx<Text>): this;
    on(event_name: "form", callback: ListenerEx<Form>): this;
    on(event_name: string, callback: (...param: any) => void): this;

    once(event_name: "player_join", callback: ListenerEx<Player>): this;
    once(event_name: "player_leave", callback: ListenerEx<Player>): this;
    once(event_name: "player_list_update", callback: ListenerEx<{ [uuid: string]: Player }>): this;
    once(event_name: "message", callback: ListenerEx<Text>): this;
    once(event_name: "form", callback: ListenerEx<Form>): this;
    once(event_name: string, callback: (...param: any) => void): this;

    connect(): Promise<void>;
    ping(): Promise<void>;
    chat(message: string): void;
    command(command: string): void;
    action(id: number, data: { position: BlockPosition; resultPosition: BlockPosition; face: number }): void;
    responseForm(form_id: number, data: object): void;
    cancelForm(form_id: number, reason: number): void;

    // Client

    options: ClientConfig;
    startGameData: StartGameData;
    profile: {
        name: string;
        uuid: string;
        xuid: string;
    };
    tick: bigint | void;
    username: string;
    viewDistance: number;
}

export declare function createBot(options: object): Bot;
