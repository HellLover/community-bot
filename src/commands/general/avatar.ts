import Command from "../../structures/Commands";
import { Client } from "../../structures/Client";
import { Colors, EmbedBuilder } from "discord.js";

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

        const avatar = member?.user?.displayAvatarURL({ forceStatic: false, extension: "png", size: 2048 });

        const embed = new EmbedBuilder()
        .setTitle(`${member?.user?.tag}'s avatar`)
        .setColor(Colors.Aqua)
        .setDescription(`[Link to the avatar](${avatar})`)
        .setImage(`${avatar}`)

        return message.reply({ embeds: [embed] })
    }
}