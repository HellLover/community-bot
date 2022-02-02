import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { Message, MessageEmbed } from "discord.js";

export default class extends Command {
    constructor(client: Client) {
        super(client, "bank", {
            description: "Store your credits on bank. This is required because wallet maxmum capacity is 50.000",
            aliases: [],
            category: "Economy",
        })
    }

    async execute(message: Message<true>, args: string[]) {

        const userdata = await this.client.database.getUser(message.author.id!, message.guildId);
        
        if(userdata.economy.wallet == null) {
            return message.channel["error"](`${message.author.tag}, bank requires credits to register, but you don't have any. To register and earn money, type \`.register\`.`)
        } else if(userdata.economy.bank != null) {
            return message.channel["error"](`${message.author.tag}, you already have a bank account.`)
        } else if(userdata.economy.wallet < 2500) {
            return message.channel["error"](`${message.author.tag}, seems you don't have enough money to register in a bank. You need more ${2500 - userdata.economy.wallet} credits to register.`)
        } else {
            userdata.economy.wallet = userdata.economy.wallet - 2500;
            userdata.economy.bank = 2500;

            userdata.save()
            .then(() => message.channel["success"](`${message.author.tag}, successfully registered to a bank! The **2,500** fee was transferred to your bank. To check your balance, type \`.balance\``))
            .catch((err) => message.channel["error"](`${message.author.tag}, Unable to save the changes as a database error occured, please try again later!`));
        }
    }
}