import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { Message } from "discord.js";

export default class extends Command {
    constructor(client: Client) {
        super(client, "pause", {
            description: "Pause the player.",
            aliases: [],
            category: "Music",
        })
    }

    async execute(client: Client, message: Message, args: string[]) {
        const queue = this.client.player.getQueue(message.guild!.id);
        if(!queue || !queue.playing) return message.reply({ content: "There's nothing playing right now to pause." });
        if(message.guild?.me?.voice.channel && message.member?.voice.channelId !== message.guild.me.voice.channelId) return message.reply({ content: "I'm playing a music on another channel." })

        queue.setPaused(true);

        return message.reply({ content: `⏸️ | Successfully paused the player.` });
    }
}