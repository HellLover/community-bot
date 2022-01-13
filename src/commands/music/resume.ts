import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { Message } from "discord.js";

export default class extends Command {
    constructor(client: Client) {
        super(client, "resume", {
            description: "Resume the player if it was paused.",
            aliases: [],
            category: "Music",
        })
    }

    async execute(message: Message, args: string[]) {
        const queue = this.client.player.getQueue(message.guild!.id);
        if(!queue) return message.reply({ content: "There's nothing playing right now." });

        queue.setPaused(false);

        return message.reply({ content: `▶️ | Successfully resumed the player.` });
    }
}