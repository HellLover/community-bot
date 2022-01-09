import { Event } from "../../structures/Events";
import { Client } from "../../handlers/ClientHandler";
import { Queue } from "discord-player";
import { TextChannel } from "discord.js";

export default class extends Event {
    constructor(client: Client) {
        super(client, "connectionError");
    }

    async execute(queue: Queue, error: Error) {

        return (queue.metadata as TextChannel).send({ embeds: [
            {
                author: { name: "A connection error occured!" },
                description: `\`${error.message}\``,
                color: "#2f3136"
            }
        ] })

    }
}