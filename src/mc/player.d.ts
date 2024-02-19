import { Bot } from "../bot";

type SkinData = {
    skin_id: string;
    play_fab_id: string;
    skin_resource_pack: string;
    skin_data: object;
    animations: any[];
    cape_data: object;
    geometry_data: string;
    geometry_data_version: string;
    animation_data: string;
    cape_id: string;
    full_skin_id: string;
    arm_size: "wide" | "slim";
    skin_color: string;
    personal_pieces: any[];
    piece_tint_colors: any[];
    premium: boolean;
    persona: boolean;
    cape_on_classic: boolean;
    primary_user: boolean;
    overriding_player_appearance: boolean;
};

export declare class Player {
    bot: Bot;
    uuid: string;
    entity_id: bigint;
    username: string;
    xbox_id: string;
    platform_chat_id: string;
    build_platform: number;
    skin_data: SkinData;
    is_teacher: boolean;
    is_host: boolean;
    constructor(param: {
        uuid: string;
        entity_unique_id: bigint;
        username: string;
        xbox_user_id: string;
        platform_chat_id: string;
        build_platform: number;
        skin_data: SkinData;
        is_teacher: boolean;
        is_host: boolean;
    });
}
