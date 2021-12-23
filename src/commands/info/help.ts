import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { MessageEmbed, MessageButton, MessageActionRow, Message } from "discord.js";

export default class extends Command {
    constructor(client: Client) {
        super(client, "help", {
            description: "Returns all the bot's commands.",
            aliases: ["commands"],
            category: "Information",
            cooldown: 10,
        })
    }

    async execute(client: Client, message: Message, args: string[]) {

     try {
        const commands = client.commands;
        const cmd = args[0]

        const prefix = (await this.client.utils.getGuildInDB(message.guild!.id)).prefix;

        if(!cmd) {
            const embed = new MessageEmbed()
            .setAuthor(`Commands List | Prefix: ${prefix}`, this.client?.user?.displayAvatarURL({ format: "png" }))
            .setDescription("To check the commands for a specified category, click on the button.\n`Config` - All the config commands.\n`Informative` - All the informative commands\n`Moderation` - All the moderation commands.\n`General` - General commands.")
            .setColor("YELLOW")
            .setTimestamp()
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: "png" }))

            let buttonRaw = new MessageActionRow().addComponents([
                new MessageButton().setCustomId("config_commands").setStyle("PRIMARY").setLabel("Config"),
                new MessageButton().setCustomId("info_commands").setStyle("PRIMARY").setLabel("Informative"),
                new MessageButton().setCustomId("moderator_commands").setStyle("PRIMARY").setLabel("Moderation"),
                new MessageButton().setCustomId("general_commands").setStyle("PRIMARY").setLabel("General"),
                new MessageButton().setCustomId("home").setStyle("DANGER").setLabel("Main Page")
            ]);

            let infoCommands = new MessageEmbed()
            .setTitle("Informative Commands")
            .setColor("BLUE")
            .setDescription("> " + commands.filter((cmd) => cmd.category === "Information").map(cmd => `\`${cmd.name}\``).join(", "))

            let configCommands = new MessageEmbed()
            .setTitle("Config Commands")
            .setColor("BLUE")
            .setDescription("> " + commands.filter((cmd) => cmd.category === "Config").map(cmd => `\`${cmd.name}\``).join(", "))

            let moderCommands = new MessageEmbed()
            .setTitle("Moderation Commands")
            .setColor("BLUE")
            .setDescription("> " + commands.filter((cmd) => cmd.category === "Moderation").map(cmd => `\`${cmd.name}\``).join(", "))

            let generalCommands = new MessageEmbed()
            .setTitle("General Commands")
            .setColor("BLUE")
            .setDescription("> " + commands.filter((cmd) => cmd.category === "General").map(cmd => `\`${cmd.name}\``).join(", "))

            const msg = await message.channel.send({ embeds: [embed], components: [buttonRaw] });

            let filter = i => i.user.id === message.author.id;

            let collector = await msg.createMessageComponentCollector({ filter, time: 60000 });

            collector.on("collect", async (i) => {
                if(!i.isButton()) return;

                switch(i.customId) {
                    case "info_commands":
                        await i.deferUpdate();
                        msg.edit({ embeds: [infoCommands] });
                        break;
                    case "general_commands":
                        await i.deferUpdate();
                        msg.edit({ embeds: [generalCommands] });
                        break;
                    case "config_commands": 
                        await i.deferUpdate();
                        msg.edit({ embeds: [configCommands] });
                        break;
                    case "moderator_commands":
                        await i.deferUpdate();
                        msg.edit({ embeds: [moderCommands] });
                        break;
                    case "home":
                        await i.deferUpdate();
                        msg.edit({ embeds: [embed] });
                        break;
                }
            });

            collector.on("end", () => {
                embed.description = `Time out! Type \`help\` again to check the commands list.`
                msg.edit({ embeds: [embed], components: [] })
            })
        } else {
            const command = this.client.commands.get(cmd) || this.client.events.get(cmd);
            if(!command) return message.reply({ content: `Command ${cmd} doesn't exist.` });

            const cmdInformation = new MessageEmbed()
            .setColor("RED")
            .setAuthor(`Information about the '${cmd}' command`, this.client?.user?.displayAvatarURL({ format: "png" }))
            .addFields([
                { name: "Name", value: `${command.name}` },
                { name: "Description", value: `${command.description || "None"}` },
                { name: "Category", value: `${command.category || "Private"}` },
                { name: "Member Permissions", value: `${command.memberPermission.join(", ") || "No permission required."}` },
            ])
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true, format: "png" }))
            return message.reply({ embeds: [cmdInformation] })
        }

      } catch(e) {
          this.client.logger.error(e);
          return undefined;
      } 
    }
}