import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { Message, MessageEmbed, MessageActionRow, MessageButton, Guild } from "discord.js";
import { embedRequestedBy, errorEmbed } from "../../utils/constants";

export default class extends Command {
    constructor(client: Client) {
        super(client, "serverinfo", {
            description: "Returns information about the current server.",
            aliases: ["si"],
            category: "Information",
        })
    }

    async execute(client: Client, message: Message, args: any[]) {

    try {

        const { guild } = message;

        let buttonRaw = new MessageActionRow().addComponents([
            new MessageButton().setCustomId("roles").setStyle("DANGER").setLabel("Roles").setEmoji("🎨"),
            new MessageButton().setCustomId("server").setStyle("PRIMARY").setLabel("Server Info").setEmoji("ℹ️"),
        ]);

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
            { name: "[Roles Size]", value: `${roleSize}`, inline: true },
            { name: "[Channels Size]", value: `${channelSize}`, inline: true },
            { name: "[Emojis Size]", value: `${emojiSize}`, inline: true },
            { name: "[Creation Date]", value: `${creationDate}`, inline: true }
        ])
        .setThumbnail(`${iconURL}`)
        .setFooter(`${embedRequestedBy(message.author).text}`, embedRequestedBy(message.author).icon_url)

        const Roles = new MessageEmbed()
        .setTitle(`Server's Roles (${guild?.roles.cache.size})`)
        .setDescription(guild?.roles.cache.filter((r) => r.id !== guild?.id).map((r) => `\`${r.name}\``).join(", ")! || "Nothing")
        .setColor("YELLOW");

        let msg = await message.reply({ embeds: [GuildEmbed], components: [buttonRaw] });

        let collector = await msg.createMessageComponentCollector({ filter: i => i.user.id === message.author.id, time: 60000 });

        collector.on("collect", async (i) => {
            if(!i.isButton()) return;

            switch(i.customId) {
                case "roles":
                    await i.deferUpdate();
                    msg.edit({ embeds: [Roles] });
                    break;
                case "server": 
                    await i.deferUpdate();
                    msg.edit({ embeds: [GuildEmbed] });
                    break;
            }
        });

        collector.on("end", () => {
            if(!msg.deleted) {
                msg.edit({ embeds: [GuildEmbed], components: [] })
            }
        })

       } catch(e) {
          return message.channel.send({ embeds: [errorEmbed(e)] });
       } 

    }
}