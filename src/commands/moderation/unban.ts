import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { Message, EmbedBuilder } from "discord.js";

export default class extends Command {
    constructor(client: Client) {
        super(client, "unban", {
            description: "Unban a member.",
            aliases: [],
            category: "Moderation",
            memberPermission: ["BAN_MEMBERS"],
            botPermission: ["BAN_MEMBERS"],
            cooldown: 5
        })
    }

    async execute(message: Message, args: string[]) {

     try {

        if(!args[0]) return message.reply({ content: "Provide a member ID to unban." });

        const IDRegex = /[0-9]{18,19}/
        if(!IDRegex.test(args[0])) return message.reply({ content: `${this.client.customEmojis.error} | You must provide an ID.` })

        const user = await this.client.users.fetch(args[0]);
        if(!user) return message.reply({ content: `${this.client.customEmojis.error} | Couldn't find the user.` });

        await message.guild?.members.unban(user);

        message.channel.send({ content: `${this.client.customEmojis.success} | Unbanned ${user.tag}.` });
        user.send({ embeds: [
            new EmbedBuilder()
            .setColor("#2f3136")
            .setAuthor({ name: `${message.author?.tag}`, iconURL: message.author?.displayAvatarURL({ forceStatic: false }) })
            .setDescription(`You were unbanned from the server ${message.guild?.name}.`)
        ] }).catch(() => {})
        

      } catch(e) {
        return message.channel.send({ embeds: [this.client.utils.errorEmbed(e)] });
      }

    }

}