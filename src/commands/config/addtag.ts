import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { Message } from "discord.js";

export default class extends Command {
    constructor(client: Client) {
        super(client, "addtag", {
            description: "Add a tag to the guild.",
            aliases: [],
            category: "Config",
            memberPermission: ["Administrator"],
            usage: ".addtag <name> <response>",
            cooldown: 10
        })
    }

    async execute(message: Message, args: any[]) {

      try {
        
        const cmdName = args[0];
        const cmdResponse = args.slice(1).join(" ");

        if (!cmdName) {
            return message.channel.send({ content: `You need to provide a name for the tag (\`${this.usage}\`).` });
        }

        if (!cmdResponse) {
            return message.channel.send({ content: `You need to provide a response for the tag (\`${this.usage}\`).` });
        }

        const guild = await this.client.database.getGuild(message.guild!.id);
        const commands = guild.custom_commands;

        if (commands && commands.find((x) => x.name === cmdName.toLowerCase()))
          return message.channel["error"]("Such a tag already exists in the guild.");

        if (this.client.commands.has(cmdName) || this.client.aliases.has(cmdName)) {
            return message.channel["error"]("Cannot create a tag which name matches one of the client's commands.");
        }

        const data = {
            name: cmdName.toLowerCase(),
            response: cmdResponse,
            author: message.author.id,
            createdAt: new Date()
        };

        await this.client.database.updateGuild(message.guild!.id, { custom_commands: !commands ? [data] : [...commands, data] });

        return message.channel["success"](`Successfully created the tag \`${cmdName}\``)

      } catch(e) {
          return message.reply({ content: `An error occured:\n\`\`\`js\n${e}\n\`\`\`` })
     }

    }
}