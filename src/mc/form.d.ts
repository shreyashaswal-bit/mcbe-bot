import { Bot } from "../bot";

type FormContent = {
    type: "label" | "input" | "dropdown";
    text: string;
    options: string[] | undefined;
};

type FormButton = {
    text: string;
};

export declare class Form {
    bot: Bot;
    id: number;
    type: "form" | "custom_form";
    title: string;
    content: FormContent | string;
    buttons: FormButton[];
    constructor(bot: Bot, param: { form_id: number; data: string });
    render(): string;
    show(): void;
    response(data: number | any[]): void;
    close(): void;
    busy(): void;
}
