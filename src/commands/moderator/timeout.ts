import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { Message } from "discord.js";
import ms from "ms";

export default class extends Command {
    constructor(client: Client) {
        super(client, "timeout", {
            description: "Time out a member.",
            aliases: [],
            category: "Moderation",
            memberPermission: ["ADMINISTRATOR"],
            botPermission: ["ADMINISTRATOR"],
            cooldown: 5,
            usage: ".timeout <@member> <time_amount>",
            examples: [
                ".timeout @HellLover#6944 10s"
            ]
        })
    }

    async execute(client: Client, message: Message, args: string[]) {

     try {

        if(!args[0]) return message.reply({ content: "Provide a member mention/id/tag to time out." });

        const member = await this.client.utils.findMember(message, args);
        if(!member) return message.reply({ content: `${this.client.customEmojis.error} | Couldn't find the member.` });
        if(member.permissions.has("ADMINISTRATOR")) return message.reply({ content: "Couldn't time out this member." })

        const time = args[1];
        const TimeRegex = /[0-9](s|m|h|d)/
        if(!time) return message.reply({ content: "Provide a time amount to time the member out." });
        if(!TimeRegex.test(time)) return message.reply({ content: `${this.client.customEmojis.error} | Invalid time format. Examples: \`60s, 10m, 10h, 1d\`` });

        const convertedTime = ms(time);
        if(convertedTime < ms("10s")) return message.reply({ content: `${this.client.customEmojis.error} | The provided time must be at least 10s (10 seconds).` });
        if(convertedTime > ms("7d")) return message.reply({ content: `${this.client.customEmojis.error} | The provided time must be less or equal to 7d (7 days).` });

        member.timeout(convertedTime).catch((e) => this.client.utils.errorEmbed(e));
        await message.channel.send({ content: `${this.client.customEmojis.success} | Timed ${member.user.tag} out for \`${time}\`!` });
        member.user.send({ content: `You were timed out on ${message.guild?.name} for \`${time}\` by ${message.author.tag}!` }).catch(() => {});


      } catch(e) {
        return message.channel.send({ embeds: [this.client.utils.errorEmbed(e)] });
      }

    }

}