import { Event } from "../../structures/Events";
import { Client } from "../../handlers/ClientHandler";
import { Queue, Track } from "discord-player";
import { TextChannel } from "discord.js";

export default class extends Event {
    constructor(client: Client) {
        super(client, "trackAdd");
    }

    async execute(queue: Queue, tracks: Track[]) {

        return (queue.metadata as TextChannel).send({ embeds: [
            {
                description: `Enqueued \`${tracks.length}\` songs.`,
                color: "#2f3136"
            }
        ] })
    }
}