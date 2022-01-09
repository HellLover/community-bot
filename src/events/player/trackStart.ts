import { Event } from "../../structures/Events";
import { Client } from "../../handlers/ClientHandler";
import { Queue, Track } from "discord-player";
import { TextChannel } from "discord.js";

export default class extends Event {
    constructor(client: Client) {
        super(client, "trackStart");
    }

    async execute(queue: Queue, track: Track) {

        const msg = await (queue.metadata as TextChannel).send({ embeds: [
            {
                description: `<a:dolphin_player:813405732535664640> Started playing [${track.title}](${track.url}) [${track.requestedBy}]`,
                color: "#2f3136"
            }
        ] })
        
        if(msg) {
            setTimeout(() => {
                msg.delete();
            }, queue.playing ? track.durationMS : 30000)
        }
    }
}