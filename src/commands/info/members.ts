import Command from "../../structures/Commands";
import { Client } from "../../structures/Client";
import { Message, EmbedBuilder } from "discord.js";
import { chunk } from "lodash";

export default class extends Command {
    constructor(client: Client) {
        super(client, "members", {
            description: "Returns all the guild's members.",
            aliases: [],
            category: "Information",
            cooldown: 20
        })
    }

    async execute(message: Message<true>, args: any[]) {
        const statusMap = {
            online: "<:online:719630983648772198>",
            idle: "<:idle:719630983782989935>",
            dnd: "<:dnd:719630983586119741>",
            offline: "<:invisible:719630983770406942>"
        }

        const members = message.guild?.members.cache.map((m) => { return { tag: m.user.tag, id: m.user.id, status: `${statusMap[m.presence?.status ?? "offline"]}` }  });

        const pages: EmbedBuilder[] = chunk(members, 10).map((data) => {
            return new EmbedBuilder()
            .setColor("#2f3136")
            .setAuthor({ name: `Guild members [${message.guild?.memberCount}]`, iconURL: `${message.guild?.iconURL({ forceStatic: false })}` })
            .setDescription(`${data.map((u) => `**User:** \`${u.tag}\` ${u.status} | **ID:** \`${u.id}\``).join("\n")}`)
        })

        if(pages.length > 1) {
            return this.client.utils.paginateEmbed(message, {
                pages,
                channel: message.channel,
                timeout: 30000,
            })
        }

        return message.reply({ embeds: [pages[0].setFooter({ text: `Page ${pages.length} / ${pages.length}`} )] })
    }
}