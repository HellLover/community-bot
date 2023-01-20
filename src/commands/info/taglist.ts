import Command from "../../structures/Commands";
import { Client } from "../../structures/Client";
import { Message, EmbedBuilder, Colors } from "discord.js";

export default class extends Command {
    constructor(client: Client) {
        super(client, "taglist", {
            description: "Lists all the server's tags.",
            aliases: [],
            category: "Information",
            cooldown: 30
        })
    }

    async execute(message: Message<true>, args: any[]) {

      try {
        
        const data = this.client.configs.get(message.guildId);

        const customCmds = data?.customCommands;
        if(!customCmds?.length) return message.reply({ content: "There is no tag in this guild yet." })

        const embed = new EmbedBuilder()
        .setColor(Colors.LuminousVividPink)
        .setAuthor({ name: "Tags" })
        .setDescription(`${customCmds.map((cmd, i) => `\`${i + 1}\`. \`${cmd.name}\` [By \`${message.guild.members.cache.get(cmd.author)?.user.tag ?? "Unknown#0000"}\`]`).join("\n")}`);
        return message.reply({ embeds: [embed] })
        

      } catch(e) {
          console.log(e)
          return message.reply({ content: `An error occured:\n\`\`\`js\n${e}\n\`\`\`` })
      }

    }
}