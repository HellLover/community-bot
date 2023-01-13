import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { GuildMember, Message } from "discord.js";

export default class extends Command {
    constructor(client: Client) {
        super(client, "hackban", {
            description: "Ban a user (not existing in the server) from the server.",
            aliases: [],
            category: "Moderation",
            memberPermission: ["BAN_MEMBERS"],
            botPermission: ["BAN_MEMBERS"],
            cooldown: 5
        })
    }

    async execute(message: Message, args: string[]) {

     try {

        if(!args[0]) return message.reply({ content: "Provide an ID to ban a user from the server." });

        const IDRegex = /\d{17,19}/
        if(!IDRegex.test(args[0])) return message.reply({ content: `${this.client.customEmojis.error} | You must provide an ID.` })

        const user = await this.client.users.fetch(args[0].match(/\d{17,19}/)![0]);
        if(!user) return message.reply({ content: `${this.client.customEmojis.error} | Couldn't find the user.` });
        if(user instanceof GuildMember) return message.reply({ content: "This command is for users, not for members. To ban a member, use `.ban` instead." })

        let reason = args.slice(1).join(" ");
        if(!reason) reason = "No reason provided."

        await message.guild?.members.ban(user, {
            reason
        })
        return message.channel.send({ content: `${this.client.customEmojis.success} | Banned ${user.tag} from the server.` });


      } catch(e) {
        return message.channel.send({ embeds: [this.client.utils.errorEmbed(e)] });
      }

    }

}