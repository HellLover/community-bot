import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { Message } from "discord.js";
import ms from "pretty-ms";

export default class extends Command {
    constructor(client: Client) {
        super(client, "daily", {
            description: "Collect your daily reward.",
            aliases: [],
            category: "Economy",
        })
    }

    async execute(message: Message<true>, args: string[]) {

        const userdata = await this.client.database.getUser(message.author.id, message.guildId);

        const now = Date.now();
        const baseamount = 500;

        let overflow = false, excess: number | null = null, streakreset = false

        const duration = ms(userdata.economy.streak.timestamp - now)

        if (userdata.economy.streak.timestamp !== 0 && userdata.economy.streak.timestamp - now > 0) {
            return message.channel["error"](`${message.author.tag}, You have already collected your daily reward!\nYou can get your next daily reward in ${duration}`)
        }

        if(!streakreset) {
            userdata.economy.streak.current++
        }

        if (userdata.economy.streak.alltime < userdata.economy.streak.current){
            userdata.economy.streak.alltime = userdata.economy.streak.current;
        }

        userdata.economy.streak.timestamp = now + 72e6;
        const amount = baseamount + 30 * userdata.economy.streak.current;

        if (userdata.economy.wallet + amount > 5e4){
            overflow = true
            excess = userdata.economy.wallet + amount - 5e4;
        }

        userdata.economy.wallet = overflow ? 5e4 : userdata.economy.wallet + amount;

        userdata.save()
        .then(() => message.channel["success"]([
            `**${message.author.tag}**, you got your **${amount}** daily reward.`,
            overflow ? `\n⚠️ **Overflow Warning**: Your wallet just overflowed! You need to transfer some of your credits to your bank!` : '',
            streakreset ? `\n⚠️ **Streak Lost**: You haven't got your succeeding daily reward. Your streak is reset (x1).` : `\n**Streak x${userdata.economy.streak.current}**`,
        ].join("")))
        .catch((err) => message.channel["error"](`${message.author.tag}, Unable to save the changes as a database error occured, please try again later!`));

    }
}