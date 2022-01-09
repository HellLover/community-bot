import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { Message } from "discord.js";

export default class extends Command {
    constructor(client: Client) {
        super(client, "skip", {
            description: "Skip the current song.",
            aliases: [],
            category: "Music",
        })
    }

    async execute(client: Client, message: Message, args: string[]) {
        const queue = this.client.player.getQueue(message.guild!.id);
        if(!queue || !queue.playing) return message.reply({ content: "There's nothing playing right now to skip." });

        queue.skip();

        return message.reply({ content: `${this.client.customEmojis.success} | Successfully skipped the current song.` });
    }
}