import { Event } from "../../structures/Events";
import { Client } from "../../handlers/ClientHandler";
import { GuildMember, VoiceChannel } from "discord.js";

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