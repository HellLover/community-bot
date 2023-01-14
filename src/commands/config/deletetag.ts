import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { Message } from "discord.js";

export default class extends Command {
    constructor(client: Client) {
        super(client, "deletetag", {
            description: "Delete a tag from the guild.",
            aliases: ["removetag"],
            category: "Config",
            memberPermission: ["Administrator"],
            usage: ".deletetag <name>",
            cooldown: 10
        })
    }

    async execute(message: Message, args: any[]) {

      try {
        
        const cmdName = args[0];
        const guild = await this.client.database.getGuild(message.guild!.id);
        const commands = guild.custom_commands;

        if (!cmdName) {
            return message.channel.send({ content: `You need to provide the name of the tag you want to delete (\`${this.usage}\`).` });
        }

        if (commands) {
            const data = commands.find((cmd) => cmd.name === cmdName.toLowerCase());
      
            if (!data) {
              return message.channel.send({ content: `${this.client.customEmojis.error} | Couldn't find the tag \`${cmdName}\`` });
            }
      
            const filtered = commands.filter(
              (cmd) => cmd.name !== cmdName.toLowerCase()
            );
      
            await this.client.database.updateGuild(message.guild!.id, {
              custom_commands: filtered,
            });
            return message.channel.send({ content: `${this.client.customEmojis.success} | Successfully deleted the tag \`${cmdName}\`` });

          } else {
            return message.channel.send({ content: `${this.client.customEmojis.error} | Couldn't find the tag \`${cmdName}\`` });
        }

      } catch(e) {
          return message.reply({ content: `An error occured:\n\`\`\`js\n${e}\n\`\`\`` })
     }

    }
}