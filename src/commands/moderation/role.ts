import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { Role, ColorResolvable, EmbedBuilder } from "discord.js";

export default class extends Command {
    constructor(client: Client) {
        super(client, "role", {
            description: "Add or remove a role from the member.",
            aliases: [],
            category: "Moderation",
            memberPermission: ["MANAGE_ROLES"],
            botPermission: ["MANAGE_ROLES"],
            cooldown: 5
        })
    }

    async execute(message, args) {

     try {

        if(!args[0]) return message.reply({ content: "You need to provide the member you want to add or remove a role." })
        const member = await this.client.utils.findMember(message, args, { index: 0 });
        if(!member) return message.reply({ content: "Couldn't find the provided member." });

        if(!args[1]) return message.reply({ content: "You need to provide the role you want to add or remove from the member." })
        const role = await this.client.utils.findRole(message, args.slice(1).join(" "));
        if(!role) return message.reply({ content: "Couldn't find the provided role." })

        if(message.guild.me.roles.highest.comparePositionTo(role as Role) < 0) return message.reply({ content: "I don't have enough high role to do add/remove a role!" })
        
        switch(member.roles.cache.has(role.id) as boolean) {
            case true:
                await member.roles.remove(role.id);
                this.createEmbed(message, "Red", `✅ Changed roles for ${member.user.tag}, -${role.name}`)
                break;
            case false:
                await member.roles.add(role.id);
                this.createEmbed(message, "Blue", `✅ Changed roles for ${member.user.tag}, +${role.name}`)
                break;
        }

      } catch(e) {
          return message.reply({ content: `An error occured:\n\`\`\`js\n${e}\n\`\`\`` })
      }
    }

    createEmbed(message, color: ColorResolvable, desc: string) {
        return message.reply({
            embeds: [
                new EmbedBuilder()
                .setColor(color)
                .setDescription(desc)
            ]
        })
    }
}