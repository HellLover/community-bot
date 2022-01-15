import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { MessageEmbed, MessageButton, MessageActionRow, Message } from "discord.js";
import { stripIndents } from "common-tags";

export default class extends Command {
    constructor(client: Client) {
        super(client, "help", {
            description: "Returns all the bot's commands.",
            aliases: ["commands"],
            category: "Information",
            cooldown: 10,
        })
    }

    async execute(message: Message, args: string[]) {

     try {
        const commands = this.client.commands;
        const cmd = args[0]

        const prefix = (await this.client.utils.getGuildInDB(message.guild!.id)).prefix;

        if(!cmd) {
            const embed = new MessageEmbed()
            .setAuthor({
                name: `Commands List | Prefix: ${prefix}`,
                iconURL: this.client?.user?.displayAvatarURL({ format: "png" })
            })
            .setColor("#2f3136")
            .setDescription(`**Tip:** Use \`${prefix}help <command>\` to get additional information about the command.`)
            .addFields([
                { name: `Informative`, value: `${commands.filter((c) => c.category === "Information").map((c) => `\`${c.name}\``).join(" | ")}` },
                { name: `General`, value: `${commands.filter((c) => c.category === "General").map((c) => `\`${c.name}\``).join(" | ")}` },
                { name: `Music (In development)`, value: `${commands.filter((c) => c.category === "Music").map((c) => `\`${c.name}\``).join(" | ")}` },
                { name: `Moderation`, value: `${commands.filter((c) => c.category === "Moderation").map((c) => `\`${c.name}\``).join(" | ")}` },
                { name: `Config`, value: `${commands.filter((c) => c.category === "Config").map((c) => `\`${c.name}\``).join(" | ")}` }
            ])
            .setTimestamp()
            .setFooter({
                text: `Requested by ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL({ dynamic: true, format: "png" })
            })

            let buttonRaw = new MessageActionRow().addComponents([
                new MessageButton().setCustomId("delete").setStyle("DANGER").setEmoji("<:Error:927240559905620009>"),
            ]);

            const msg = await message.channel.send({ embeds: [embed], components: [buttonRaw] });

            let filter = i => i.user.id === message.author.id;

            let collector = await msg.createMessageComponentCollector({ filter, time: 60000 });

            collector.on("collect", async (i) => {
                if(!i.isButton()) return;

                if(i.customId === "delete") {
                    msg.delete();
                }
            });

            collector.on("end", () => {
                msg.edit({ embeds: [embed], components: [] })
            })

        } else {
            const command = this.client.commands.get(cmd) || this.client.events.get(cmd);
            if(!command) return message.reply({ content: `The command \`${cmd}\` doesn't exist.` });

            const cmdInformation = new MessageEmbed()
            .setColor("#2f3136")
            .setAuthor({
                name: `${this.client?.user?.username}`,
                iconURL: this.client?.user?.displayAvatarURL({ format: "png" })
            })
            .setDescription(stripIndents`
                **${command.name}**${command.description ? ` - ${command.description}` : ""}

                Examples:\n${command.examples.length ? command.examples.join("\n") : "No examples."}
            `)
            .addFields([
                { name: "Usage", value: `${command.usage || "No usage."}` },
                { name: "Category", value: `${command.category || "Private"}` },
                { name: "Member/Bot Permissions", value: `${command.memberPermission.join(", ") || "None."} / ${command.botPermission.join(", ") || "None."}` },
            ])
            .setFooter({
                text: `Requested by ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL({ dynamic: true, format: "png" })
            })
            return message.reply({ embeds: [cmdInformation] })
        }

      } catch(e) {
        return message.channel.send({ embeds: [this.client.utils.errorEmbed(e)] });
      } 
    }
}