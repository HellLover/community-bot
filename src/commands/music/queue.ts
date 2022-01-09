import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { Message, MessageEmbed } from "discord.js";

export default class extends Command {
    constructor(client: Client) {
        super(client, "queue", {
            description: "Returns the current and coming songs.",
            aliases: [],
            category: "Music",
        })
    }

    async execute(client: Client, message: Message, args: string[]) {

      try {
          
        const queue = this.client.player.getQueue(message.guild!.id);
        if(!queue) return message.reply({ content: "There's nothing playing right now." });

        if(!queue.tracks[0]) return message.channel.send({ content: `No song in the queue after the current one.` });

        const tracks = queue.tracks.map((track, i) => `**№${i + 1}** - [${track.title}](${track.url}) [${track.requestedBy}]`);
        const methods = ['', '🔁', '🔂'];

        const songs = queue.tracks.length;
        const nextSongs = songs > 5 ? `and **${songs - 5}** other song(s)...` : `**${songs}** song(s) in the playlist.`;

        const embed = new MessageEmbed()
        .setColor("GOLD")
        .setAuthor({ name: `Server queue - ${message.guild?.name} ${methods[queue.repeatMode]}`, iconURL: `${this.client.user?.displayAvatarURL({ format: "png" })}` })
        .setThumbnail(`${queue.current.thumbnail}`)
        .setDescription(`▶️ [${queue.current.title}](${queue.current.url})\n\n${tracks.slice(0, 5).join('\n')}\n\n${nextSongs}`)
        .setTimestamp()
        return message.channel.send({ embeds: [embed] })

      } catch(e) {
         return message.channel.send({ embeds: [this.client.utils.errorEmbed(e)] })
      }

    }
}