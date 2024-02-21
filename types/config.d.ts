export declare type Config = {
    client: {
        host: string;
        port: number;
        version: string;
        offline: false;
        profilesFolder: string;
        [key: string]: any;
    };
    bot: {
        show_form: boolean;
        auto_close_form: boolean;
        auto_respawn: boolean;
    };
    mc: {
        lang: string;
    };
    program: {
        exit_when_bot_closed: boolean;
    };
};
