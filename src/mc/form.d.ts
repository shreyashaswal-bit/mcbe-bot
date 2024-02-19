import { Bot } from "../bot";

export declare class Form {
    constructor(bot: Bot, param: object);
    render(): string;
    show(): void;
    response(data: number | any[]): void;
    close(): void;
    busy(): void;
}
