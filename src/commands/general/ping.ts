import Command from "../../structures/Commands";
import { Client } from "../../structures/Client";

export default class extends Command {
    constructor(client: Client) {
        super(client, "ping", {
            description: "Returns the bot's ping.",
            aliases: [],
            category: "General",
        })
    }

    async execute(message, args) {
        message.channel.send({ content: `Pong!` })
    }
}