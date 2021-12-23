import * as Discord from "discord.js";

export const embedRequestedBy = (author: Discord.User) => {
    return {
        text: `Requested by ${author?.tag}`,
        icon_url: `${author.displayAvatarURL({ format: "png", dynamic: true })}`
    }
};