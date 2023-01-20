import Command from "../../structures/Commands";
import { Client } from "../../structures/Client";
import { EmbedBuilder, Message } from "discord.js";

export default class extends Command {
    constructor(client: Client) {
        super(client, "leaderboard", {
            description: "Current guild's rank leaderboard.",
            aliases: [],
            category: "Leveling",
            cooldown: 10
        })
    }

    async execute(message: Message<true>, args: any[]) {
        const positions = {
            1: "🥇",
            2: "🥈",
            3: "🥉"
        }

        let users = (await this.client.levels.all()).filter((v) => v.id.startsWith("xp_"));
        if(!users.length) return message.reply({ content: "The leaderboard is not available yet.." });

        let sortedUsers = users.sort((a, b) => b.value.xp - a.value.xp);

        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setAuthor({ name: `Rank Leaderboard [${message.guild.nameAcronym}]`, iconURL: `${message.guild.iconURL({ extension: "png", forceStatic: false })}` })
            .setTimestamp()
            .setDescription(`${sortedUsers.map((user, i) => {
                const tag = message.guild.members.cache.get(`${user.id.match(/\d+/)?.[0]}`)?.user.tag ?? "Unknown#0000"
                const position = i + 1;
                return `${positions[position] ?? `\`${position}\`.`} ${tag} - Level ${user.value.level}\n${this.progressBar(user.value.xp, user.value.level * 300)}`
            }).join("\n")}`)
            .setFooter({ text: `Your position: ${users.findIndex((x) => x.id.match(/\d+/)?.[0] === message.author.id) + 1}`, iconURL: message.author.displayAvatarURL({ forceStatic: false }) })
        return message.reply({ embeds: [embed] })

    }

    progressBar(min: number, max: number) {
        let per = min / max;
        let progress = "";
        let filled = Math.floor(per * 10);
        let empty = 10 - filled;

        for(let i = 0; i < filled; i++) {
            progress += "[▰](https://www.youtube.com/watch?v=gSo9E5FbbOg&ab_channel=Flameex)"
        }

        for(let i = 0; i < empty; i++) {
            progress += "▱"
        }

        return progress;
    }
}