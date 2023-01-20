import { Event } from "../../structures/Events";
import { Client } from "../../structures/Client";
import { EmbedBuilder, GuildMember, VoiceChannel } from "discord.js";

export default class extends Event {
    constructor(client: Client) {
        super(client, "guildMemberAdd");
    }

    async execute(member: GuildMember) {
        if(!member.guild || member.user.bot) return;

        if(member.guild.id == "715290558779883532") {
            const role = member.guild.roles.cache.get("715298416199991346");

            if(role && !member.roles.cache.has(role.id)) {
                member.roles.add(role.id).catch(() => {})
            }

            await member.user.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#2f3136")
                        .setTitle(`Welcome to ${member.guild.name}!`)
                        .setDescription("Feel free to ask questions and chat with our members. Have fun in our server! :)\n\n[Server invite](https://discord.gg/TYhSGhWGvm)\n[Invite Dolphin](https://discord.com/api/oauth2/authorize?client_id=713713873915478036&permissions=8&scope=bot)")
                ]
            }).catch(() => {})

            const voiceChannels = {
                totalCount: "1062354998152937523",
                memberCount: "933419726447726632",
                botCount: "933420137640501338"
            }

            if(member.guild.memberCount !== member.guild.members.cache.size) await member.guild.members.fetch();

            const totalMembersChannel = member.guild.channels.cache.get(voiceChannels.totalCount) as VoiceChannel, totalMembersSize = member.guild.memberCount;
            const botsChannel = member.guild.channels.cache.get(voiceChannels.botCount) as VoiceChannel, botsSize = member.guild.members.cache.filter((m) => m.user.bot).size;
            const membersChannel = member.guild.channels.cache.get(voiceChannels.memberCount) as VoiceChannel, membersSize = totalMembersSize - botsSize;

            setTimeout(() => {
                totalMembersChannel.setName(`[👥] Total: ${totalMembersSize}`);
                membersChannel.setName(`  ↳ Members: ${membersSize}`);
                botsChannel.setName(`  ↳ Bots: ${botsSize}`);
            }, 30 * 1000) // 30 seconds cooldown
        }
    }
}