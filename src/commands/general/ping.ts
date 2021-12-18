import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";

export default class extends Command {
    constructor(client: Client) {
        super(client, "ping", {
            description: "Returns the bot's ping.",
            aliases: [],
            category: "General",
        })
    }

    async execute(client, message, args) {
        message.channel.send({ content: `Pong!` })
    }
}