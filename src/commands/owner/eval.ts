import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import utils from "util";

export default class extends Command {
    constructor(client: Client) {
        super(client, "eval", {
            description: "Evaluate a TypeScript code.",
            aliases: ["ev"],
            category: "OwnerOnly",
            cooldown: 3,
            ownerOnly: true
        })
    }

    async execute(client, message, args) {

     try {
         
        let code = args.join(" ");

        const result = this.clean(eval(code));
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