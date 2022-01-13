import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import utils from "util";
import { Message } from "discord.js";

export default class extends Command {
    constructor(client: Client) {
        super(client, "eval", {
            description: "Evaluate a JavaScript code.",
            aliases: ["ev"],
            category: "OwnerOnly",
            cooldown: 3,
            ownerOnly: true
        })
    }

    async execute(message: Message, args: any[]) {

        let code = args.join(" ");

        const flags = this.client.utils.commandFlags(code);
        const awaiter = flags.find((x) => "await" in x);
        if (awaiter) code = code.replace("--await", "").trim();

     try {

        const result = this.clean(awaiter ? await eval(code) : eval(code));
        return message.reply({ content: `\`\`\`js\n${result}\n\`\`\`` })

     } catch(e) {
       return message.channel.send({ content: `An error occured:\n \`\`\`js\n${e}\n\`\`\`` })
     }

    function doReply(object: Object | undefined) {
        return message.channel.send({ content: `\`\`\`javascript\n${require('util').inspect(object, { depth: 0 })}\n\`\`\`` });
    }

}

    clean(text: any) {
        if (typeof text !== "string") text = utils.inspect(text, { depth: 0 });
  
        text = text
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/, "@" + String.fromCharCode(8203))
  
        return text;
      
    }
}