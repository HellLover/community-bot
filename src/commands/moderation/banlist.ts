import Command from "../../structures/Commands";
import { Client } from "../../structures/Client";
import { Message, EmbedBuilder } from "discord.js";

export default class extends Command {
    constructor(client: Client) {
        super(client, "banlist", {
            description: "Lists the server's bans.",
            aliases: [],
            category: "Moderation",
            memberPermission: ["BanMembers"],
            cooldown: 10
        })
    }

    async execute(message: Message, args: string[]) {

     try {

        const fetchedBans = await message.guild?.bans.fetch();
        if(!fetchedBans) return message.reply({ content: "There is no ban in this server." })

        const embed = new EmbedBuilder()
        .setAuthor({ name: `${message.guild?.name}'s bans [${fetchedBans?.size}]`, iconURL: `${message.guild?.iconURL({ forceStatic: false }) }` })
        .setDescription(`${fetchedBans?.map((ban) => `— **User**: ${ban.user.tag} (\`${ban.user.id}\`) :: **Ban reason**: ${ban.reason || "No reason."}`).join("\n")}`)
        .setColor("#2f3136")
        .setTimestamp()
        .setFooter({ text: `Requested by ${message.author.tag}` })
        return message.reply({ embeds: [embed] })

      } catch(e) {
        return message.channel.send({ embeds: [this.client.utils.errorEmbed(e)] });
      }

    }

}