import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { Message } from "discord.js";

export default class extends Command {
    constructor(client: Client) {
        super(client, "jump", {
            description: "Jumps to a particular position in the queue.",
            aliases: [],
            category: "Music",
        })
    }

    async execute(message: Message, args: any[]) {

      try {
        const queue = this.client.player.getQueue(message.guild!.id);

        if(!queue || !queue.playing) return message.reply({ content: "There's nothing playing right now." });
        if(message.guild?.me?.voice.channel && message.member?.voice.channelId !== message.guild.me.voice.channelId) return message.reply({ content: "I'm playing a music on another channel." })

        const pos: number = args[0]

        if(!pos) return message.reply({ content: "Please, provide a position to jump to." });
        if(!Number(pos)) return message.reply({ content: "You must provide a number." });

        if(queue) {
            await queue.jump(Number(pos - 1))
            return message.reply({ content: `${this.client.customEmojis.success} | Jumped to the position \`${pos}\` in the queue.` })
        }
      } catch(e) {
          this.client.logger.error(e);
          return message.reply({ content: `${this.client.customEmojis.error} | Couldn't jump to that position.` })
      }
    }
}