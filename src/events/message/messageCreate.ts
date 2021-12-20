import { Event } from "../../structures/Events";
import { Client } from "../../handlers/ClientHandler";
import * as DJS from "discord.js";

export default class extends Event {
    constructor(client: Client) {
        super(client, "messageCreate");
    }

    async execute(client: Client, message: DJS.Message<true>) {
        if (message.author.bot || !message.guild) return;

        const GuildData = await this.client.utils.getGuildInDB(message.guild?.id)

        let prefix = GuildData.prefix;
  
        if (!message.content.startsWith(prefix)) return;

        let args = message.content.slice(prefix.length).trim().split(/ +/g);
        let cmd = args?.shift()?.toLowerCase();
        const command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));

        if(!command) return;

        if (command.ownerOnly && message.author.id !== client.config.ownerID) {
            return;
        }

        if (command.cooldown) {
            const { cooldowns } = client;
      
            if (!cooldowns.has(command.name)) {
                cooldowns.set(command.name, new Map());
            }
      
            const now = Date.now();
            const timestamps = cooldowns.get(command.name);
            const cooldownAmount = command.cooldown * 1000;
      
            if (timestamps.has(message.author.id)) {
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return message.reply({ content: `Calm down dude! You're in cooldown. Wait more ${timeLeft} second(s) to execute the command again.` });
                }
            }
      
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }

        if (command.memberPermission.length && !message.member?.permissions.has(command.memberPermission)) {
            return message.reply({ content: `You're missing the following permission(s) to execute the command — **${this.client.utils.missingPerms}**` });
        }

        try {
           command.execute(client, message, args)
        } catch(e) {
            console.log(e)
        }
    }
    
}