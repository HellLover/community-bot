import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";

export default class extends Command {
    constructor(client: Client) {
        super(client, "setprefix", {
            description: "Change the bot's prefix.",
            aliases: [],
            category: "Config",
            memberPermission: ["Administrator"],
            cooldown: 10
        })
    }

    async execute(message, args) {

      try {
        const prefix = args.join(" ");
        if(!prefix) return message.reply({ content: `Provide an argument to change the prefix for this server.` });
        if(prefix.length > 5) return message.reply({ content: "❌ The prefix must be less than or equal to 5" });

        await this.client.database.updateGuild(message.guild?.id, {
          prefix
        })

        return message.reply({ content: `✅ Successfully changed the server prefix to \`${prefix}\`!` })

      } catch(e) {
          return message.reply({ content: `An error occured:\n\`\`\`js\n${e}\n\`\`\`` })
      }

    }
}