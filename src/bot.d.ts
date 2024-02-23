import { Client } from "bedrock-protocol";

import { Player } from "../types/player";
import { StartGameData } from "../types/startGameData";
import { BlockPosition } from "./util/data";
import { Form } from "./mc/form";

export declare class Bot extends Client {
    players: { [uuid: string]: Player };
    currentForm: Form | null;

    showForm: boolean;
    autoCloseForm: boolean;
    autoRespawn: boolean;

    on(event_name: "player_join", callback: (player: Player) => void): this;
    on(event_name: "player_leave", callback: (player: Player) => void): this;
    on(event_name: "player_list_update", callback: (player_list: { [uuid: string]: Player }) => void): this;
    on(event_name: "message", callback: (message: string) => void): this;
    on(event_name: "form", callback: (form: Form) => void): this;
    on(event_name: string, callback: (param: any) => void): this;

    once(event_name: "player_join", callback: (player: Player) => void): this;
    once(event_name: "player_leave", callback: (player: Player) => void): this;
    once(event_name: "player_list_update", callback: (player_list: { [uuid: string]: Player }) => void): this;
    once(event_name: "message", callback: (message: string) => void): this;
    once(event_name: "form", callback: (form: Form) => void): this;
    once(event_name: string, callback: (param: any) => void): this;

    chat(message: string): void;
    command(command: string): void;
    action(id: number, data: { position: BlockPosition; result_position: BlockPosition; face: number }): void;
    responseForm(form_id: number, data: object): void;
    cancelForm(form_id: number, reason: number): void;

    // Client

    startGameData: StartGameData;
    tick: bigint;
    profile: {
        name: string;
        uuid: string;
        xuid: string;
    };
    username: string;
}

export declare function createBot(options: object): Bot;
