import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { Message, MessageEmbed } from "discord.js";

export default class extends Command {
    constructor(client: Client) {
        super(client, "register", {
            description: "Register and start earning money.",
            aliases: [],
            category: "Economy",
        })
    }

    async execute(message: Message<true>, args: string[]) {

        const userdata = await this.client.database.getUser(message.author.id!, message.guildId);
        if(userdata.economy.wallet != null) {
            return message.channel["error"]("You already have an account. Type `.bal` to check your balance.")
        }

        userdata.economy.wallet = Math.floor(Math.random() * 250) + 250;

        userdata.save()
        .then(() => message.channel["success"](`${message.author.tag}, you were successfully registered! You received **${userdata.economy.wallet}** as a gift!\nTo check your balance, type \`.bal\``))
        .catch((err) => message.channel["error"](`${message.author.tag}, Unable to save the changes as a database error occured, please try again later!`));
    }
}