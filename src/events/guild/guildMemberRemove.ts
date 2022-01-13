import { Event } from "../../structures/Events";
import { Client } from "../../handlers/ClientHandler";
import { GuildMember, TextChannel } from "discord.js";

export default class extends Event {
    constructor(client: Client) {
        super(client, "guildMemberRemove");
    }

    async execute(member: GuildMember) {
        if(!member.guild || member.user.bot) return;

        if(member.guild.id == "715290558779883532") {
            const logchannel = this.client.channels.cache.get("931109092498497576") as TextChannel

            if(logchannel) {
                logchannel.send({ content: `📤 ${member.user.tag} left the server! [Joined the server: <t:${Math.round(member.joinedTimestamp! / 1000)}:R>]` }); 
            }
        }
    }
}