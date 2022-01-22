import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { Message } from "discord.js";

export default class extends Command {
    constructor(client: Client) {
        super(client, "addcommand", {
            description: "Add a custom command to the guild.",
            aliases: ["addcmd"],
            category: "Config",
            memberPermission: ["ADMINISTRATOR"],
            usage: ".addcmd <name> <response>"
        })
    }

    async execute(message: Message, args: any[]) {

      try {
        
        const cmdName = args[0];
        const cmdResponse = args.slice(1).join(" ");

        if (!cmdName) {
            return message.channel.send({ content: `You need to provide a name for the command (\`${this.usage}\`).` });
        }

        if (!cmdResponse) {
            return message.channel.send({ content: `You need to provide a response for the command (\`${this.usage}\`).` });
        }

        const guild = await this.client.database.getGuild(message.guild!.id);
        const commands = guild.custom_commands;

        if (commands && commands.find((x) => x.name === cmdName.toLowerCase()))
          return message.channel.send({ content: "Such a command already exists in the guild commands." });

        if (this.client.commands.has(cmdName) || this.client.aliases.has(cmdName)) {
            return message.channel.send({ content: "Such a command already exists in the bot commands." });
        }

        const data = {
            name: cmdName.toLowerCase(),
            response: cmdResponse,
        };

        if (!commands) {
             await this.client.database.updateGuild(message.guild!.id, { custom_commands: [data] });
        } else {
             await this.client.database.updateGuild(message.guild!.id, { custom_commands: [...commands, data] });
        }
        return message.reply({ content: `Successfully created the command \`${cmdName}\`` })

      } catch(e) {
          return message.reply({ content: `An error occured:\n\`\`\`js\n${e}\n\`\`\`` })
     }

    }
}