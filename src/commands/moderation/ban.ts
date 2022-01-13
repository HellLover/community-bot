import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { Message, MessageEmbed } from "discord.js";

export default class extends Command {
    constructor(client: Client) {
        super(client, "ban", {
            description: "Ban a member from the server.",
            aliases: [],
            category: "Moderation",
            memberPermission: ["BAN_MEMBERS"],
            cooldown: 5
        })
    }

    async execute(message: Message, args: string[]) {

     try {

        if(!args[0]) return message.reply({ content: "Provide a member mention/id/tag to ban from the server." });

        const member = await this.client.utils.findMember(message, args);
        if(!member) return message.reply({ content: `${this.client.customEmojis.error} | Couldn't find the member.` });

        let reason = args.slice(1).join(" ");
        if(!reason) reason = "No reason provided."

        if(member?.permissions.has("BAN_MEMBERS") || !member?.bannable) return message.reply({ content: `${this.client.customEmojis.error} | Couldn't ban this member.` });

        await message.guild?.members.ban(member.user, {
            reason
        })
        message.channel.send({ content: `${this.client.customEmojis.success} | Banned ${member.user.tag} from the server.` });
        member.user.send({ embeds: [
            new MessageEmbed()
            .setColor("#2f3136")
            .setAuthor({
                name: `${message.author?.tag}`,
                iconURL: `${message.author?.displayAvatarURL({ dynamic: true })}`
            })
            .setDescription(`You were banned from the server ${message.guild?.name}${reason ? ` for **${reason}**.` : "."}`)
        ] }).catch(() => {})


      } catch(e) {
        return message.channel.send({ embeds: [this.client.utils.errorEmbed(e)] });
      }

    }

}