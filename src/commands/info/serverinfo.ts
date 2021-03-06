import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { Message, MessageEmbed, MessageActionRow, MessageButton, Guild } from "discord.js";

export default class extends Command {
    constructor(client: Client) {
        super(client, "serverinfo", {
            description: "Returns information about the current server.",
            aliases: ["si"],
            category: "Information",
        })
    }

    async execute(message: Message, args: any[]) {

    try {

        const { guild } = message;

        const memberCount = guild?.memberCount;
        const name = guild?.name;
        const owner = await guild?.fetchOwner().then((u) => { return u.user.tag });
        const boosts = {
            count: guild?.premiumSubscriptionCount,
            tier: guild?.premiumTier
        }
        const verificationLevel = guild?.verificationLevel;
        const creationDate = `<t:${Math.round(guild?.createdTimestamp! / 1000)}>`;
        const roleSize = guild?.roles.cache.size;
        const channelSize = guild?.channels.cache.size;
        const emojiSize = guild?.emojis.cache.size;
        const iconURL = guild?.iconURL({ size: 2048, format: "png" });

        const GuildEmbed = new MessageEmbed()
        .setAuthor({
            name: `Information about the server [${name}]`,
            iconURL: `${iconURL}`
        })
        .setColor("#2f3136")
        .addFields([
            { name: "Owner", value: `${owner}` },
            { name: "Member Count", value: `${memberCount}` },
            { name: "Boosts", value: `Count: ${boosts.count}, Tier: ${boosts.tier}` },
            { name: "Verification Level", value: `${verificationLevel}` },
            { name: "Roles Size", value: `${roleSize}` },
            { name: "Channels Size", value: `${channelSize}` },
            { name: "Emojis Size", value: `${emojiSize}` },
            { name: "Creation Date", value: `${creationDate}` }
        ])
        .setThumbnail(`${iconURL}`)
        .setFooter({
            text: `${this.client.utils.embedRequestedBy(message.author).text}`,
            iconURL: this.client.utils.embedRequestedBy(message.author).icon_url
        })

        return message.reply({ embeds: [GuildEmbed] });

       } catch(e) {
          return message.channel.send({ embeds: [this.client.utils.errorEmbed(e)] });
       } 

    }
}