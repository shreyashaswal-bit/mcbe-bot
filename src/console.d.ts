import { EventEmitter } from "events";

export declare class Console extends EventEmitter {
    start(): Promise<void>;
}

export const inputConsole: Console;
