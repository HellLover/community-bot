import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { Message, MessageEmbed } from "discord.js";
import { embedRequestedBy } from "../../utils/constants";

export default class extends Command {
    constructor(client: Client) {
        super(client, "serverinfo", {
            description: "Returns information about the current server.",
            aliases: ["si"],
            category: "Information",
        })
    }

    async execute(client: Client, message: Message, args: any[]) {
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
        .setAuthor(`Information about this server [${name}]`, `${iconURL}`)
        .setColor("BLUE")
        .setDescription("The main support server for <@713713873915478036> (Dolphin#4366)")
        .addFields([
            { name: "[Owner]", value: `${owner}`, inline: true },
            { name: "[Member Count]", value: `${memberCount}`, inline: true },
            { name: "[Boosts]", value: `Count: ${boosts.count}, Tier: ${boosts.tier}`, inline: true },
            { name: "[Verification Level]", value: `${verificationLevel}`, inline: true },
            { name: "[Roles Size]", value: `${roleSize} (Run \`roles\` to check them all.)`, inline: true },
            { name: "[Channels Size]", value: `${channelSize}`, inline: true },
            { name: "[Emojis Size]", value: `${emojiSize} (Run \`emojis\` to check them all.)`, inline: true },
            { name: "[Creation Date]", value: `${creationDate}`, inline: true }
        ])
        .setThumbnail(`${iconURL}`)
        .setFooter(`${embedRequestedBy(message.author).text}`, embedRequestedBy(message.author).icon_url)
        return message.reply({ embeds: [GuildEmbed] })

    }
}