import * as Discord from "discord.js";

export const embedRequestedBy = (author: Discord.User) => {
    return {
        text: `Requested by ${author?.tag}`,
        icon_url: `${author.displayAvatarURL({ format: "png", dynamic: true })}`
    }
};

export const errorEmbed = (error: any): Discord.MessageEmbed => {
    return new Discord.MessageEmbed()
        .setColor("RED")
        .setTitle("An error occured!")
        .setDescription(`\`\`\`js\n${error}\n\`\`\``)
        .setTimestamp();
}