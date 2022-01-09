import { Event } from "../../structures/Events";
import { Client } from "../../handlers/ClientHandler";
import { Queue } from "discord-player";
import { TextChannel } from "discord.js";

export default class extends Event {
    constructor(client: Client) {
        super(client, "queueEnd");
    }

    async execute(queue: Queue) {

        return (queue.metadata as TextChannel).send({ embeds: [
            {
                description: `The queue is empty! Add more songs by typing \`.play <song name/url>\`.`,
                color: "#2f3136"
            }
        ] })

    }
}