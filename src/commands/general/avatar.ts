import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { GuildMember, MessageEmbed } from "discord.js";

export default class extends Command {
    constructor(client: Client) {
        super(client, "avatar", {
            description: "Returns the member's avatar.",
            aliases: [],
            category: "General",
        })
    }

    async execute(message, args) {
        const member = await this.client.utils.findMember(message, args, { allowAuthor: true });

        const avatar = member?.user?.displayAvatarURL({ dynamic: true, format: "png", size: 2048 });

        const embed = new MessageEmbed()
        .setTitle(`${member?.user?.tag}'s avatar`)
        .setColor("AQUA")
        .setDescription(`[Link to the avatar](${avatar})`)
        .setImage(`${avatar}`)

        return message.reply({ embeds: [embed] })
    }
}