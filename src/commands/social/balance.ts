import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { Message, MessageEmbed } from "discord.js";

export default class extends Command {
    constructor(client: Client) {
        super(client, "balance", {
            description: "Returns the member's balance.",
            aliases: [],
            category: "Economy",
        })
    }

    async execute(message: Message<true>, args: string[]) {

        const userdata = await this.client.database.getUser(message.author.id!, message.guildId);
        if(userdata.economy.wallet == null) {
          return message.channel["error"](`${message.author.tag}, seems you don't have a wallet! To create one, type \`.register\``)
        }

        const dailyUsed = userdata.economy.streak.timestamp !== 0 && userdata.economy.streak.timestamp - Date.now() > 0;

        function streak(current: number, max: number){
            const active = '🌕', inactive = '🌑', left = max - current === 10 ? 0 : max - current;
            if (left === 0){
              return dailyUsed ? active.repeat(10) : inactive.repeat(10);
            } else {
              return active.repeat(current || max) + inactive.repeat(left);
            };
        };

        const embed = new MessageEmbed()
        .setDescription(
            `\u200b\n💰 **${userdata.economy.wallet}** credits in wallet.\n\n${
              userdata.economy.bank !== null
              ? `💰 **${userdata.economy.bank}** credits in bank.`
              : `Seems like you don't have a bank yet.\nCreate one now by typing \`.bank\``
            }\n\n━━━━━━━━━━━━━━\nDaily Streak: **${userdata.economy.streak.current}** (The best of all time: **${userdata.economy.streak.alltime}**)\n**${10 - userdata.economy.streak.current % 10}** streak(s) left for **Item Reward ✨**\n\n${
              streak(userdata.economy.streak.current % 10, 10)
        }\n━━━━━━━━━━━━━━\n${
          dailyUsed ? '\\✔️ Daily reward already **claimed**!' : `\\⚠️ Daily reward is **avaliable**!`
        }`)
        .setAuthor({ name: `${message.author.tag}'s wallet` })
        .setColor('GREY')
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        return message.reply({ embeds: [embed] })
    }
}