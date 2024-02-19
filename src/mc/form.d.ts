import { Bot } from "../bot";

type FormContent = {
    type: "label" | "input" | "dropdown";
    text: string;
    options: string[] | undefined;
};

type FormButton = {
    test: string;
};

export declare class Form {
    bot: Bot;
    id: number;
    type: "form" | "custom_form";
    title: string;
    content: FormContent | string;
    buttons: FormButton[];
    constructor(bot: Bot, param: object);
    render(): string;
    show(): void;
    response(data: number | any[]): void;
    close(): void;
    busy(): void;
}
