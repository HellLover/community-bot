import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { Message } from "discord.js";

export default class extends Command {
    constructor(client: Client) {
        super(client, "leveling", {
            description: "Enable or disable leveling system.",
            aliases: [],
            category: "Config",
            memberPermission: ["Administrator"],
            cooldown: 10
        })
    }

    async execute(message: Message<true>, args: any[]) {

      try {
        const option = args[0];

        switch(option) {
            case "enable":
                await this.client.database.updateGuild(message.guild.id, {
                    leveling: true
                });
                message.channel["success"]("Successfully **enabled** the leveling system in this server.")
                break;
            case "disable":
                await this.client.database.updateGuild(message.guild.id, {
                    leveling: false
                });
                message.channel["success"]("Successfully **disabled** the leveling system in this server.")
                break;
            default:
                return message.channel["error"](`${message.author}, You should either \`enable\` or \`disable\` the leveling system.`);
        }
      } catch(e) {
          return message.reply({ content: `An error occured:\n\`\`\`js\n${e}\n\`\`\`` })
      }

    }
}