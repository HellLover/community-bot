import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { Message, MessageEmbed } from "discord.js";

export default class extends Command {
    constructor(client: Client) {
        super(client, "userinfo", {
            description: "Returns information about the user.",
            aliases: ["ui"],
            category: "Information",
        })
    }

    async execute(message: Message, args: any[]) {
        const statusMap = {
            online: "<:online:719630983648772198> Online",
            idle: "<:idle:719630983782989935> Idle",
            dnd: "<:dnd:719630983586119741> Do Not Disturb",
            offline: "<:invisible:719630983770406942> Offline"
        }

        const deviceMap = {
            desktop: "🖥️ Desktop",
            mobile: "📱 Mobile",
            web: "🌐 Browser"
        }

        const member = await this.client.utils.findMember(message, args, { allowAuthor: true })
        if(!member) return message.reply({ content: "Please, provide a mention/tag/id for this command."})

        const embed = new MessageEmbed()
        .setColor("#2f3136")
        .setAuthor({
            name: `Information about ${member.displayName}`,
            iconURL: member.user.displayAvatarURL({ format: "png", dynamic: true })
        })
        .addFields([
            { name: "User", value: `${member.user.tag}` },
            { name: "Created at", value: `<t:${Math.round(member.user.createdTimestamp / 1000)}>` },
            { name: "Joined the guild at", value: `<t:${Math.round(member.joinedTimestamp! / 1000)}>` },
            { name: "Status", value: `${statusMap[member.presence?.status! || "offline"]}` },
            { name: "Activities", value: `${member.presence?.activities.length ? member.presence?.activities.map((p) => `- ${p.type.toUpperCase()}: ${p.name}`).join("\n") : "Nothing"}` },
            { name: "Device(s)", value: `${member.presence?.clientStatus ? deviceMap[Object.keys(member.presence?.clientStatus!)[0]] : "None"}` }
        ])
        .setThumbnail(member.user.displayAvatarURL({ format: "png", dynamic: true, size: 2048 }))
        .setFooter({
            text: `Requested by ${message.author.tag}`,
            iconURL: message.author.displayAvatarURL({ format: "png", dynamic: true })
        })
        .setTimestamp()

        return message.reply({ embeds: [embed] })
    }
}