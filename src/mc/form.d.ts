import { Bot } from "../bot";

enum FormType {
    FORM = "form",
    CUSTOM_FORM = "custom_form",
}

enum FormContentType {
    LABEL = "label",
    INPUT = "input",
    DROPDOWN = "dropdown",
}

type FormContent = {
    type: FormContentType;
    text: string;
    options: string[] | undefined;
};

type FormButton = {
    text: string;
};

export declare class Form {
    bot: Bot;
    id: number;
    type: FormType;
    title: string;
    content: FormContent[] | string;
    buttons: FormButton[];

    alive: boolean;

    constructor(bot: Bot, param: { form_id: number; data: string });

    render(): string;
    show(): void;
    response(data: number | any[]): void;
    close(): void;
    busy(): void;
}
