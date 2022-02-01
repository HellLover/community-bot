import { Event } from "../../structures/Events";
import { Client } from "../../handlers/ClientHandler";
import * as DJS from "discord.js";

export default class extends Event {
    constructor(client: Client) {
        super(client, "messageCreate");
    }

    async execute(message: DJS.Message) {
        if (message.author.bot || !message.guild) return;
        if(message.channel.type === "DM") return;
        if(!message.channel.permissionsFor(message.guild.me as DJS.GuildMember).has(["SEND_MESSAGES", "VIEW_CHANNEL"])) return;

        if(message.author["blacklisted"] && message.author["isDev"]() == false) return;

        const GuildData = await this.client.database.getGuild(message.guild?.id)

        let prefix = GuildData.prefix;
        let customCmds = GuildData.custom_commands;

        if(message.content.match(new RegExp(`^<@!?${this.client?.user?.id}>( |)$`))){
            return message.reply({ embeds: [{ color: "#2f3136", description: `My prefix for this server is \`${prefix}\`!` }] })
        }
  
        if (!message.content.startsWith(prefix)) return;

        let args = message.content.slice(prefix.length).trim().split(/ +/g);
        let cmd = args?.shift()?.toLowerCase();
        const command = this.client.commands.get(cmd) || this.client.commands.get(this.client.aliases.get(cmd));
        
        if (customCmds) {
          const customCmd = customCmds.find((x) => x.name === cmd);
          if (customCmd) message.channel.send({ content: `${customCmd.response}` });
        }

        if(!command) return;

        if (command.ownerOnly && message.author.id !== this.client.config.ownerID) {
            return;
        }

        if (command.cooldown) {
            const { cooldowns } = this.client;
      
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
                    return message.reply({ content: `Calm down dude! You're in cooldown. Wait more ${timeLeft.toFixed(1)} second(s) to execute the command again.` });
                }
            }
      
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }

        if (command.memberPermission.length && !message.member?.permissions.has(command.memberPermission)) {
            return message.reply({ content: `You're missing the following permission(s) to execute the command — **${this.client.utils.missingPerms(command.memberPermission)}**` });
        }

        if (command.botPermission.length && !message.guild.me?.permissions.has(command.botPermission)) {
            return message.reply({ content: `I'm missing the following permission(s) to execute the command — **${this.client.utils.missingPerms(command.botPermission)}**` });
        }

        try {
           command.execute(message, args)
        } catch(e) {
            (this.client.channels.cache.get("716419256618582018") as DJS.TextChannel).send({ embeds: [this.client.utils.errorEmbed(e)] })
        }
    }
    
}
