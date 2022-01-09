import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { Message } from "discord.js";
import{ QueryType } from 'discord-player';

export default class extends Command {
    constructor(client: Client) {
        super(client, "play", {
            description: "Play a song.",
            aliases: [],
            category: "Music",
            usage: ".play <song name/url>",
            examples: [
                "— play Alan Walker & Ava Max - Alone, Pt. II",
                "— play https://www.youtube.com/watch?v=HhjHYkPQ8F0&ab_channel=AlanWalker",
                "— play https://open.spotify.com/playlist/0ojY0acFtyCSJPY8MLmeOg"
            ]
        })
    }

    async execute(client: Client, message: Message, args: string[]) {
        if(!args[0]) return message.reply({ content: "Please, provide a song url/name to play." });

        if(!message.member?.voice.channel) return message.reply({ content: "You must be connected to a voice channel in order to play a music." });
        if(message.guild?.me?.voice.channel && message.member?.voice.channelId !== message.guild.me.voice.channelId) return message.reply({ content: "I'm playing a music on another channel." })

        const res = await this.client.player.search(args.join(' '), {
            requestedBy: message.author,
            searchEngine: QueryType.AUTO
        });

        if (!res || !res.tracks.length) return message.reply({ content: "No result found with that query." });

        const queue = await this.client.player.createQueue(message.guild!, {
            metadata: message.channel,
            bufferingTimeout: 1000,
            leaveOnEnd: false,
            leaveOnStop: true,
            leaveOnEmptyCooldown: 60 * 1000 * 2, // 2 minutes
            leaveOnEmpty: true,
        });

        try {
            if (!queue.connection) await queue.connect(message.member?.voice.channel!);
        } catch {
            await this.client.player.deleteQueue(`${message.guild?.id}`);
            return message.reply({ content: `Couldn't join your voice channel. (\`${message.member?.voice.channel!.name}\`)` });
        }

        const infomsg = await message.channel.send({ content: `⏱️ | Loading the ${res.playlist ? 'playlist' : 'track'}...` });

        res.playlist ? queue.addTracks(res.tracks) : queue.addTrack(res.tracks[0]);

        if (!queue.playing) await queue.play();

        if(infomsg) {
            setTimeout(() => {
                infomsg.delete()
            }, 5000)
        }
    }
}