import Command from "../../structures/Commands";
import { Client } from "../../structures/Client";
import { EmbedBuilder, time } from "discord.js"

export default class extends Command {
    constructor(client: Client) {
        super(client, "ping", {
            description: "Returns the bot's ping and uptime.",
            aliases: [],
            category: "General",
        })
    }

    async execute(message, args) {
        const msg = await message.reply({ embeds: [{ color: 0xfff, description: "Please wait..." }] })
        const ping = Math.round(msg.createdTimestamp - message.createdTimestamp);

        const duration = time(new Date(`${this.client.readyAt}`), "R");
      
        const embed = new EmbedBuilder()
            .setAuthor({ name: `${this.client.user?.username} | Ping panel`, iconURL: this.client.user?.displayAvatarURL() })
            .setColor(0xfff)
            .addFields([
                { name: "🏓 Ping", value: `\`${ping}\`ms` },
                { name: "⏲️ Uptime", value: `Ready since: ${duration}` }
            ])
        return msg.edit({ embeds: [embed] })
    }
}
