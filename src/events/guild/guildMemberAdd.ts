import { Event } from "../../structures/Events";
import { Client } from "../../handlers/ClientHandler";
import { GuildMember, MessageEmbed } from "discord.js";

export default class extends Event {
    constructor(client: Client) {
        super(client, "guildMemberAdd");
    }

    async execute(member: GuildMember) {
        if(!member.guild) return;
        if(member.guild.id != "715290558779883532") return;

        if(member.guild.me?.permissions.has("MANAGE_ROLES") || !member.roles.cache.has("715298416199991346")) await member.roles.add("715298416199991346");

        const inviteEmbed = new MessageEmbed()
        .setColor("BLUE")
        .setDescription(`Take this [invite link](https://discord.gg/TYhSGhWGvm) in case you leave the server or just want to share it with your friends.`)

        return member.user.send({
            content: `<:D_peepowaveV2:779001715797786656> Welcome to Dolphin's Squad! We are happy to see you! If you have any questions about Dolphin, feel free to ask them in the server.`,
            embeds: [inviteEmbed]
        }).catch(() => {});
    }
}