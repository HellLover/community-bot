import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { Colors, EmbedBuilder, Message } from "discord.js";

export default class extends Command {
    constructor(client: Client) {
        super(client, "rank", {
            description: "A member's rank.",
            aliases: [],
            category: "Leveling",
            cooldown: 5
        })
    }

    async execute(message: Message<true>, args: any[]) {
        const member = await this.client.utils.findMember(message, args, { allowAuthor: true });
        if(member?.user.bot) {
            return message.channel["error"](`${message.author}, bots don't have rank profile.`);
        }

        await message.channel.sendTyping();

        const userLevelData = await this.client.levels.get<{ xp: number, level: number }>(`xp_${member?.user.id}_${message.guild.id}`);
        if(!userLevelData) return message.channel["error"]("This user hasn't earned anything yet...");

        const level = userLevelData.level;
        const xp = userLevelData.xp;
        const requiredXp = level * 300;

        const embed = new EmbedBuilder()
            .setColor(Colors.Blue)
            .setAuthor({ name: `${member?.user.tag}`, iconURL: `${message.guild.iconURL({ extension: "png" })}` })
            .addFields([
                {
                    name: "Xp", 
                    value: `\`${xp}\` / \`${requiredXp}\``,
                    inline: true
                },
                {
                    name: "Level", 
                    value: `\`${level}\``,
                    inline: true
                },
                {
                    name: "Progress", 
                    value: `${this.progressBar(xp, requiredXp)} (${(xp / requiredXp * 100).toFixed(1)}%)`,
                    inline: false
                }
            ])
            .setTimestamp()
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ extension: "png" }) })
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