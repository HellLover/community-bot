import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { EmbedBuilder, ButtonBuilder, ActionRowBuilder, Message, ButtonStyle } from "discord.js";
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

        const prefix = (await this.client.database.getGuild(message.guild!.id)).prefix;

        if(!cmd) {
            const embed = new EmbedBuilder()
            .setAuthor({
                name: `Commands List | Prefix: ${prefix}`,
                iconURL: this.client?.user?.displayAvatarURL({ extension: "png" })
            })
            .setColor("#2f3136")
            .setDescription(`**Tip:** Use \`${prefix}help <command>\` to get additional information about the command.`)
            .addFields([
                { name: `Utility`, value: `${commands.filter((c) => c.category === "Information").map((c) => `\`${c.name}\``).join(" | ")}` },
                { name: `General`, value: `${commands.filter((c) => c.category === "General").map((c) => `\`${c.name}\``).join(" | ")}` },
                { name: `Moderation`, value: `${commands.filter((c) => c.category === "Moderation").map((c) => `\`${c.name}\``).join(" | ")}` },
                { name: `Config`, value: `${commands.filter((c) => c.category === "Config").map((c) => `\`${c.name}\``).join(" | ")}` }
            ])
            .setTimestamp()
            .setFooter({
                text: `Requested by ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL({ forceStatic: false, extension: "png" })
            })

            let buttonRaw = new ActionRowBuilder<ButtonBuilder>().addComponents([
                new ButtonBuilder().setCustomId("delete").setStyle(ButtonStyle.Danger).setEmoji("<:Error:927240559905620009>").setLabel("Close"),
            ]);

            const msg = await message.channel.send({ embeds: [embed], components: [buttonRaw] });

            let filter = i => i.user.id === message.author.id;

            let collector = await msg.createMessageComponentCollector({ filter, time: 60000 });

            collector.on("collect", async (i) => {
                if(!i.isButton()) return;

                if(i.customId === "delete") {
                    msg.delete().catch(() => {});;
                }
            });

            collector.on("end", () => {
                msg.edit({ embeds: [embed], components: [] }).catch(() => {});
            })

        } else {
            const command = this.client.commands.get(cmd) || this.client.events.get(cmd);
            if(!command) return message.reply({ content: `The command \`${cmd}\` doesn't exist.` });

            const cmdInformation = new EmbedBuilder()
            .setColor("#2f3136")
            .setAuthor({
                name: `${this.client?.user?.username}`,
                iconURL: this.client?.user?.displayAvatarURL({ extension: "png" })
            })
            .setDescription(stripIndents`
                **${command.name}**${command.description ? ` - ${command.description}` : ""}

                Examples:\n${command.examples.length ? command.examples.join("\n") : "No examples."}
            `)
            .addFields([
                { name: "Usage", value: `${command.usage || "No usage."}` },
                { name: "Category", value: `${command.category || "Private"}` },
                { name: "Member / Bot Permissions", value: `${command.memberPermission.length ? this.client.utils.missingPerms(command.memberPermission) : "None."} / ${command.botPermission.length ? this.client.utils.missingPerms(command.botPermission) : "None."}` },
            ])
            .setFooter({
                text: `Requested by ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL({ forceStatic: false, extension: "png" })
            })
            return message.reply({ embeds: [cmdInformation] })
        }

      } catch(e) {
            return message.channel.send({ embeds: [this.client.utils.errorEmbed(e)] });
      } 
    }
}
