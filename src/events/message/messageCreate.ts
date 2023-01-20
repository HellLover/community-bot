import { Event } from "../../structures/Events";
import { Client } from "../../structures/Client";
import * as DJS from "discord.js";

export default class extends Event {
    constructor(client: Client) {
        super(client, "messageCreate");
    }

    async execute(message: DJS.Message<true>) {
        if (message.author.bot || !message.guild) return;
        if(!message.channel.permissionsFor(message.guild.members.me as DJS.GuildMember).has(["SendMessages", "ViewChannel"])) return;

        const GuildData = this.client.configs.get(message.guildId);
        if(!GuildData) {
            await this.client.database.addGuild(message.guildId);
        }

        let prefix = GuildData?.prefix;
        let customCmds = GuildData?.customCommands;

        if(message.content.match(new RegExp(`^<@!?${this.client?.user?.id}>( |)$`))){
            return message.reply({ embeds: [{ color: DJS.Colors.Red, description: `My prefix for this server is \`${prefix}\`!` }] })
        }

        if(GuildData?.leveling) {
            const userLevelData = await this.client.levels.get<Record<"xp" | "level", number>>(`xp_${message.author.id}_${message.guild.id}`);
            if(!userLevelData) return this.client.levels.set(`xp_${message.author.id}_${message.guild.id}`, {
                xp: 0,
                level: 1
            });

            if (userLevelData.xp >= Infinity) return;

            let currentXp = userLevelData.xp, currentLvl = userLevelData.level;
            let nextLvlXp = currentLvl * 300;

            await this.client.levels.set(`xp_${message.author.id}_${message.guild.id}`, {
                xp: currentXp + Number(Math.floor(Math.random() * 70) + 1),
                level: currentLvl
            })

            if(nextLvlXp <= userLevelData.xp) {
                await this.client.levels.set(`xp_${message.author.id}_${message.guild.id}`, {
                    xp: userLevelData.xp - nextLvlXp,
                    level: currentLvl + 1
                })

                return message.channel.send(`[LEVEL_UP] ${message.author.tag}: Level ${userLevelData.level}, Xp ${userLevelData.xp}`)
                    .then((msg) => setTimeout(() => msg.deletable && msg.delete(), 7000))
            }
        }
  
        if (!message.content.toLowerCase().startsWith(`${prefix}`)) return;

        let args = message.content.slice(prefix?.length).trim().split(/ +/g);
        let cmd = args?.shift()?.toLowerCase();
        const command = this.client.commands.get(cmd) || this.client.commands.get(this.client.aliases.get(cmd));
        
        if (customCmds) {
          const customCmd = customCmds.find((x) => x.name === cmd);
          if (customCmd) {
            if(customCmd.visibility === "private" && customCmd.author !== message.author.id) {
                return message.reply({ content: "You can't use this tag as it's marked as `private`." }).then((msg) => setTimeout(() => msg.delete(), 7000));
            }

            return message.reply({ content: `${customCmd.response}` });
          }
        }

        if(!command) return;

        if (command.ownerOnly && message.author.id !== process.env["OWNER_ID"]) {
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

        if (command.botPermission.length && !message.guild.members.me?.permissions.has(command.botPermission)) {
            return message.reply({ content: `I'm missing the following permission(s) to execute the command — **${this.client.utils.missingPerms(command.botPermission)}**` });
        }

        try {
           command.execute(message, args)
        } catch(e) {
           this.client.logger.error(e);
        }
    }
    
}