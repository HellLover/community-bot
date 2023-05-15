import Command from "../../structures/Commands";
import { Client } from "../../structures/Client";
import { MessageEmbed, time } from "discord.js"

export default class extends Command {
    constructor(client: Client) {
        super(client, "ping", {
            description: "Returns the bot's ping and uptime.",
            aliases: [],
            category: "General",
        })
    }

    async execute(message, args) {
        const msg = await message.reply({ embeds: [{ color: colors.WHITE, description: "Please wait..." }] })
        const ping = Math.round(msg.createdTimestamp - message.createdTimestamp);

        const duration = time(new Date(`${this.client.readyAt}`), "R");
      
        const embed = new MessageEmbed()
            .setAuthor({ name: `${this.client.user?.username} | Ping panel`, iconURL: this.client.user?.displayAvatarURL() })
            .setColor(message.guild.me.displayHexColor || colors.BLUE)
            .addField("🏓 Ping", `\`${ping}\`ms`)
            .addField("⏲️ Uptime", `Ready since: ${duration}`)
        return msg.edit({ embeds: [embed] })
    }
}
