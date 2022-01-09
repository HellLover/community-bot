import Command from "../../structures/Commands";
import { parse } from "twemoji-parser";
import { Client } from "../../handlers/ClientHandler";
import { MessageEmbed, Util } from "discord.js";

export default class extends Command {
    constructor(client: Client) {
        super(client, "stealemoji", {
            description: "Steal an emoji from other servers.",
            aliases: ["steale"],
            category: "Moderation",
        })
    }

    async execute(client, message, args) {

     try {

        const emoji = args[0]
        if(!emoji) return message.reply({ content: "Please provide an emoji or link to add to the server." });

        const name = args[1];

        if(emoji.startsWith("https://cdn.discordapp.com/emojis/")) {
            await message.guild.emojis.create(emoji, name ? name : `emoji_${message.guild.emojis.cache.size + 1}`);

            const embed = new MessageEmbed()
            .setAuthor({
              name: "Success!"
            })
            .setDescription(`Successfully added the emoji.`)
            .setColor("YELLOW")
            return message.reply({ embeds: [embed] })
        }

        const customEmoji = Util.parseEmoji(emoji);

        if (customEmoji?.id) {
            const link = `https://cdn.discordapp.com/emojis/${customEmoji.id}.${customEmoji?.animated ? "gif" : "png"}`;

            await message.guild.emojis.create(link, name ? name : `emoji_${message.guild.emojis.cache.size + 1}`);

            const embed = new MessageEmbed()
            .setAuthor({
              name: "Success!"
            })
            .setDescription(`Successfully added the emoji.`)
            .setColor("YELLOW")
            return message.reply({ embeds: [embed] })
        }

        const foundEmoji = parse(emoji, { assetType: "png" });
        if (!foundEmoji[0]) {
          return message.reply({
            content: "An invalid emoji was provided.",
          });
        }
    
        message.reply({
          content: "You can use normal emojis without adding them to the server.",
        });

      } catch(e) {
        return message.channel.send({ embeds: [this.client.utils.errorEmbed(e)] });
      }

    }
}