export declare type ClientConfig = {
    host: string;
    port: number;
    version: string;
    offline: false;
    profilesFolder: string;
    [key: string]: any;
};

export declare type BotConfig = {
    show_form: boolean;
    auto_close_form: boolean;
    auto_respawn: boolean;
};

export declare type McConfig = {
    lang: string;
};

export declare type ProgramConfig = {
    exit_when_bot_closed: boolean;
};

export declare type Config = {
    client: ClientConfig;
    bot: BotConfig;
    mc: McConfig;
    program: ProgramConfig;
};
