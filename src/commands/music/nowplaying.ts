import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { Message, MessageEmbed } from "discord.js";

export default class extends Command {
    constructor(client: Client) {
        super(client, "nowplaying", {
            description: "Returns the current playing track.",
            aliases: ["np"],
            category: "Music",
        })
    }

    async execute(client: Client, message: Message, args: string[]) {
        const queue = this.client.player.getQueue(message.guild!.id);

        if(!queue || !queue.playing) return message.reply({ content: "There's nothing playing right now to show." });
        if(message.guild?.me?.voice.channel && message.member?.voice.channelId !== message.guild.me.voice.channelId) return message.reply({ content: "I'm playing a music on another channel." })

        const currentTrack = queue.current;

        const embed = new MessageEmbed()
        .setColor("#2f3136")
        .setAuthor({
            name: `${currentTrack.author}`,
            iconURL: "https://cdn.discordapp.com/emojis/813405732535664640.gif"
        })
        .setDescription(`[${currentTrack.title}](${currentTrack.url}) | [🔊 ${queue.volume}%]`)
        .addFields([
            { name: 'Duration', value: `${queue.createProgressBar({ indicator: "🤨", timecodes: true })}` },
            { name: 'Requested By', value: `${currentTrack.requestedBy.username}` }
        ])
        .setThumbnail(`${currentTrack.thumbnail}`);
        return message.reply({ embeds: [embed] })
    }
}