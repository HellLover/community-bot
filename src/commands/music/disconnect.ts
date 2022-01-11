import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { Message } from "discord.js";

export default class extends Command {
    constructor(client: Client) {
        super(client, "disconnect", {
            description: "Disconnects from the voice.",
            aliases: [],
            category: "Music",
        })
    }

    async execute(client: Client, message: Message, args: string[]) {
        const queue = this.client.player.getQueue(message.guild!.id);

        if(message.guild?.me?.voice.channel && message.member?.voice.channelId !== message.guild.me.voice.channelId) return message.reply({ content: "You cannot disconnect me from the voice as I'm playing music on another channel." })

        if(queue) {
            queue.connection.disconnect();
            return message.reply({ content: `Left the channel \`${message.member?.voice.channel?.name}\`.` })
        }

    }
}