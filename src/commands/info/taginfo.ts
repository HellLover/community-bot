import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { Message, EmbedBuilder, Colors, codeBlock } from "discord.js";
import { CustomCommandData } from "../../database/models/GuildModel";

export default class extends Command {
    constructor(client: Client) {
        super(client, "taginfo", {
            description: "Shows information about a specified tag.",
            aliases: ["viewtag"],
            category: "Information",
            cooldown: 10
        })
    }

    async execute(message: Message<true>, args: any[]) {

      try {
        
        const tag = args[0];
        if(!tag) return message.reply({ content: "Please include a tag name." })

        const availableTags: CustomCommandData[] = (await this.client.database.getGuild(message.guildId)).custom_commands;

        const foundTag = availableTags.find((x) => tag.toLowerCase() === x.name.toLowerCase());
        if(!foundTag) return message.reply({ content: `I'm sorry, there is no tag in this server with name \`${tag}\`.` })

        const tagCreationDate = new Intl.DateTimeFormat("ru", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }).format(foundTag.createdAt)
        const tagAuthor = message.guild.members.cache.get(foundTag.author) ?? (await message.guild.members.fetch(foundTag.author));

        if(foundTag.visibility === "private" && foundTag.author !== message.author.id) {
            return message.reply({ content: "You can't view this tag as it's marked as `private`." }).then((msg) => setTimeout(() => msg.delete(), 7000));
        }

        const embed = new EmbedBuilder()
            .setColor(Colors.LuminousVividPink)
            .setAuthor({ name: `Tag: ${tag}`, iconURL: `${message.guild.iconURL({ extension: "png", forceStatic: false })}` })
            .addFields([
                {
                    name: "Content",
                    value: `${foundTag.response}`,
                    inline: false
                },
                {
                    name: "Description",
                    value: `${foundTag.description ?? "No description"}`,
                    inline: false
                },
                {
                    name: "Name",
                    value: `\`${foundTag.name}\``,
                    inline: true
                },
                {
                    name: "Author",
                    value: `\`${tagAuthor.user.tag} [${tagAuthor.id}]\``,
                    inline: true
                },
                {
                    name: "Created at",
                    value: `\`${tagCreationDate}\``,
                    inline: true
                }
            ])
            .setTimestamp()
            .setFooter({ text: `Requested by ${message.author.tag}` })
        return message.reply({ embeds: [embed] });

      } catch(e) {
          return message.reply({ content: `An error occured:\n\`\`\`js\n${e}\n\`\`\`` })
      }

    }
}