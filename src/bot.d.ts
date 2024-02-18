import { Client } from "bedrock-protocol";
import { Player } from "./data";
import { BlockPosition } from "./data";

export declare class Bot extends Client {
    playerList: Player[]
    currentForm: object | null

    autoCloseForm: boolean
    autoRespawn: boolean

    on(event_name: "player_list_update", callback: (player_list: Player[]) => void);

    chat(message: string): void;
    command(command: string): void;
    action(id: number, position: BlockPosition, result_position: BlockPosition, face: number): void;
    respawn(data: object): void;
    responseForm(param: object, data: object): void;
    cancelForm(param: object, reason: number): void;

}

export declare function createBot(options: object): Bot;
