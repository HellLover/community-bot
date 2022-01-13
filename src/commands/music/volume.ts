import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { Message } from "discord.js";

export default class extends Command {
    constructor(client: Client) {
        super(client, "volume", {
            description: "Change the player's volume.",
            aliases: ["vol"],
            category: "Music",
            usage: ".volume <number>"
        })
    }

    async execute(message: Message, args: string[]) {

    try {

        const queue = this.client.player.getQueue(message.guild!.id);

        if(!queue || !queue.playing) return message.reply({ content: "There's nothing playing right now." });

        const volume = parseInt(args[0]);
        if(!volume) return message.reply({ content: `The current volume is \`${queue.volume}%\`. To change the volume enter a valid number between \`1\` and \`200\`!` });
        if(queue.volume == volume) return message.reply({ content: `${this.client.customEmojis.error} | The volume is already set to the privided one. Provde another number to change the volume.` });
        if(volume < 0 || volume > 200) return message.reply({ content: `${this.client.customEmojis.error} | Invalid volume number! The volume must be between \`1\` and \`200\`!` });

        queue.setVolume(volume);

        return message.channel.send({ content: `${this.client.customEmojis.success} | The volume has been modified to \`${volume}\`/\`200\`!` })

      } catch(e) {
          return message.channel.send({ embeds: [this.client.utils.errorEmbed(e)] })
      }
    }
}