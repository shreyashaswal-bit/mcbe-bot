class Player {
    constructor(
        bot,
        {
            uuid,
            entity_unique_id,
            username,
            xbox_user_id,
            platform_chat_id,
            build_platform,
            skin_data,
            is_teacher,
            is_host,
        },
    ) {
        this.bot = bot;
        this.uuid = uuid;
        this.entity_id = entity_unique_id;
        this.username = username;
        this.xbox_id = xbox_user_id;
        this.platform_chat_id = platform_chat_id;
        this.build_platform = build_platform;
        this.skin_data = skin_data;
        this.is_teacher = is_teacher;
        this.is_host = is_host;
    }
}

module.exports = { Player };
