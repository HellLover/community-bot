import { Client } from "../handlers/ClientHandler";
import { GuildModel } from "../database/models/export";
import * as DJS from "discord.js";
import { EmbedPaginateOptions } from "../interfaces/Interfaces";

export default class ClientUtils {
    client: Client

    constructor(client) {
        this.client = client;
    }

    // Database functions
    async getGuildInDB(guildId: string) {
        if(!guildId) console.warn("[Function: getGuildInDB]: Missing the guild ID.");
    
        try {
          let guild = await this.client.database.models.get("Guild")?.findOne({ id: guildId });
      
          if (!guild) {
            guild = await this.addGuild(guildId);
          }
      
          return guild;
        } catch (e) {
          console.error(e);
        }
    }

    async addGuild(guildId: string) {
        if(!guildId) console.warn("[Function: addGuild]: Missing the guild ID.");
    
        try {
          const guild = new GuildModel.collection({ id: guildId });
      
          await guild.save();
      
          return guild;
        } catch (e) {
          console.error(e);
        }
    }

    async updateGuildInDB(guildId: string, settings: object) {
        if(!guildId) console.warn("[Function: updateGuildInDB]: Missing the guild ID.");
        if(!settings) console.warn("[Function: updateGuildInDB]: Missing the settings option.");
        
        try {
          if (typeof settings !== "object") {
            throw Error("'settings' must be an object");
          }
      
          // check if guild exists
          const guild = await this.getGuildInDB(guildId);
      
          if (!guild) {
            await this.addGuild(guildId);
          }
      
          await this.client.database.models.get("Guild")?.findOneAndUpdate({ id: guildId }, settings);
        } catch (e) {
          console.error(e);
        }
    }

    // Other functions
    missingPerms(member, perms) {
        const missingPerms = member.permissions.missing(perms)
        .map(str => `\`${str.replace(/_/g, ' ').toLowerCase().replace(/\b(\w)/g, char => char.toUpperCase())}\``);
    
        return missingPerms.length > 1 ?
        `${missingPerms.slice(0, 1).join(", ")} and ${missingPerms.slice(-1)[0]}` :
        missingPerms[0];
    }

    async findMember(
        message: Partial<DJS.Message>,
        args: string[],
        options?: { allowAuthor?: boolean; index?: number },
    ): Promise<DJS.GuildMember | undefined | null> {
        if (!message.guild) return;
        const index = options?.index ?? 0;
    
        try {
          let member: DJS.GuildMember | null | undefined;
          const arg = (args[index]?.replace?.(/[<@!>]/gi, "") || args[index]) as DJS.Snowflake;
    
          const mention =
            "mentions" in message // check if the first mention is not the bot prefix
              ? message.mentions?.users.first()?.id !== this.client.user?.id
                ? message.mentions?.users.first()
                : message.mentions?.users.first(1)[1]
              : null;
    
          member =
            message.guild.members.cache.find((m) => m.user.id === mention?.id) ||
            message.guild.members.cache.get(arg) ||
            message.guild.members.cache.find((m) => m.user.id === args[index]) ||
            (message.guild.members.cache.find((m) => m.user.tag === args[index]) as DJS.GuildMember);
    
          if (!member && arg) {
            const fetched = await message.guild.members.fetch(arg).catch(() => null);
    
            if (fetched) {
              // eslint-disable-next-line
              member = fetched;
            }
          }
    
          if (!member && options?.allowAuthor) {
            // @ts-expect-error ignore
            member = new DJS.GuildMember(this.client, message.member!, message.guild);
          }
    
          return member;
        } catch (e) {
          const error = e instanceof Error ? e : null;
    
          if (error?.message?.includes("DiscordAPIError: Unknown Member")) return undefined;
          if (error?.message?.includes("is not a snowflake.")) return undefined;
    
          console.log(e)
        }
      }

      async findRole(message: DJS.Message, arg: DJS.Snowflake): Promise<DJS.Role | null> {
        if(!message.guild) return null;

        return(
          message.mentions.roles.first() ||
          message.guild.roles.cache.get(arg) ||
          message.guild.roles.cache.find((r) => r.name === arg) ||
          message.guild.roles.cache.find((r) => r.name.startsWith(arg)) ||
          message.guild.roles.fetch(arg)
        )
      }

      embedRequestedBy = (author: DJS.User) => {
        return {
            text: `Requested by ${author?.tag}`,
            icon_url: `${author.displayAvatarURL({ format: "png", dynamic: true })}`
        }
      };
    
      errorEmbed = (error): DJS.MessageEmbed => {
        return new DJS.MessageEmbed()
            .setColor("#2f3136")
            .setTitle("An error occured!")
            .addFields([
              { name: "Message", value: `\`\`\`js\n${error.message}\n\`\`\`` },
              { name: "Stack", value: `\`\`\`js\n${error.stack}\n\`\`\`` }
            ])
      }

      commandFlags(args) {
        if (!Array.isArray(args)) args = args.split(" ");
        const regex = /--([\wа-я]+)(\s([\wа-я]+))?/gi;
 
        return (args.join(" ").match(regex) ?? []).map((element) => {
           const [tag, val] = element.slice(2).split(" ");
           return { [tag]: val ?? null };
        });
     }

     async paginateEmbed(message: DJS.Message, options: EmbedPaginateOptions) {
      if (!options.timeout) options.timeout = 60000;
      if (!options.backEmoji) options.backEmoji = "⬅";
      if (!options.stopEmoji) options.stopEmoji = "🛑";
      if (!options.forwardEmoji) options.forwardEmoji = "➡";
      if (!options.filter) options.filter = () => true;

      let ButtonRow = new DJS.MessageActionRow().addComponents([
        new DJS.MessageButton().setEmoji(options.backEmoji).setCustomId("back").setStyle("SUCCESS"),
        new DJS.MessageButton().setEmoji(options.stopEmoji).setCustomId("stop").setStyle("DANGER"),
        new DJS.MessageButton().setEmoji(options.forwardEmoji).setCustomId("forward").setStyle("SUCCESS")
      ]);
 
      let currentPage = 0;
      const cpm = await options.channel.send({ embeds: [options.pages[currentPage].setFooter({ text: `Page ${currentPage + 1} / ${options.pages.length}` })], components: [ButtonRow] });   
      const collector = cpm.createMessageComponentCollector({ time: options.timeout });
  
      collector.on("collect", async (i) => {
        if(!i.isButton()) return;
        if(i.user.id !== message.author?.id) i.reply({ content: "You cannot use the buttons.", ephemeral: true })

        switch(i.customId) {
          case "back":
            await i.deferUpdate();
            currentPage = currentPage > 0 ? --currentPage : options.pages.length - 1;
            break;
          case "stop":
            await i.deferUpdate();
            cpm.delete().catch(() => {});
            break;
          case "forward":
            await i.deferUpdate();
            currentPage = currentPage + 1 < options.pages.length ? ++currentPage : 0;
            break;
        }

        cpm.edit({ embeds: [options.pages[currentPage].setFooter({ text: `Page ${currentPage + 1} / ${options.pages.length}` })] }).catch(() => {});
      })
  
      collector.on("end", () => {
        ButtonRow.components.forEach((c) => c.setDisabled(true))
        cpm.edit({ embeds: [options.pages[currentPage].setFooter({ text: `Page ${currentPage + 1} / ${options.pages.length}` })], components: [ButtonRow] }).catch(() => {})
      });
  
      return cpm;
  }

}