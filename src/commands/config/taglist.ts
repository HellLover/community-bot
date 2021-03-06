import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { Message, MessageEmbed } from "discord.js";

export default class extends Command {
    constructor(client: Client) {
        super(client, "taglist", {
            description: "Lists all the server's tags.",
            aliases: [],
            category: "Config",
            memberPermission: [],
            cooldown: 30
        })
    }

    async execute(message: Message, args: any[]) {

      try {
        
        const data = await message.guild?.["fetchSettings"]();

        const customCmds = data.custom_commands;

        if(customCmds.length > 0) {
            const embed = new MessageEmbed()
            .setColor("LUMINOUS_VIVID_PINK")
            .setAuthor({ name: "Custom Commands" })
            .setDescription(`${customCmds.map((cmd, i) => `\`${i + 1}\`. \`${cmd.name}\``).join("\n")}`);
            return message.reply({ embeds: [embed] })
        } else {
            return message.reply({ content: "There is no tag in this guild yet." })
        }
        

      } catch(e) {
          return message.reply({ content: `An error occured:\n\`\`\`js\n${e}\n\`\`\`` })
      }

    }
}