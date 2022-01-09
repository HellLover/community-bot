import { Event } from "../../structures/Events";
import { Client } from "../../handlers/ClientHandler";
import { Queue } from "discord-player";
import { TextChannel } from "discord.js";

export default class extends Event {
    constructor(client: Client) {
        super(client, "channelEmpty");
    }

    async execute(queue: Queue) {

        return (queue.metadata as TextChannel).send({ embeds: [
            {
                description: `There is no one left in the voice channel.`,
                color: "#2f3136"
            }
        ] })

    }
}