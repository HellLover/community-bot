import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { Message } from "discord.js";

export default class extends Command {
    constructor(client: Client) {
        super(client, "stop", {
            description: "Stop the player if it's playing.",
            aliases: [],
            category: "Music",
        })
    }

    async execute(message: Message, args: string[]) {
        // const queue = this.client.player.getQueue(message.guild!.id);

        // if(!queue || !queue.playing) return message.reply({ content: "There's nothing playing right now to stop." });
        // if(message.guild?.me?.voice.channel && message.member?.voice.channelId !== message.guild.me.voice.channelId) return message.reply({ content: "I'm playing a music on another channel." })

        // if(queue) {
        //     queue.stop();
        //     return message.reply({ content: `${this.client.customEmojis.success} | Successfully stopped the player.` });
        // }

    }
}