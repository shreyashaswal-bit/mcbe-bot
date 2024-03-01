export declare type BaseText = {
    text: void | string;
    translate: void | string;
    with: void | string[] | RawText;
};

export declare type RawText = {
    rawtext: string[] | BaseText[];
};

export declare type Message = {
    message: string[];
};

export declare type TranslationMessage = {
    message: string;
    parameters: string[];
};

export declare type JsonMessage = {
    message: string;
    needs_translation: void | boolean;
    parameters: string[];
};
