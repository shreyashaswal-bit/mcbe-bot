import { EventEmitter } from "events";

export declare class Console extends EventEmitter {
    start(): Promise<void>;
    on(event_name: "input", callback: (input: string) => void);
}

export const inputConsole: Console;
