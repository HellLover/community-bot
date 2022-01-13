import { Event } from "../../structures/Events";
import { Client } from "../../handlers/ClientHandler";
import { GuildMember, TextChannel } from "discord.js";

export default class extends Event {
    constructor(client: Client) {
        super(client, "guildMemberAdd");
    }

    async execute(member: GuildMember) {
        if(!member.guild || member.user.bot) return;

        if(member.guild.id == "715290558779883532") {
            const role = member.guild.roles.cache.get("715298416199991346");
            const logchannel = this.client.channels.cache.get("931109092498497576") as TextChannel

            if(role && !member.roles.cache.has(role.id)) {
                member.roles.add(role.id).catch(() => {})
            }

            if(logchannel) {
                logchannel.send({ content: `📥 ${member.user.tag} joined the server! [Account created: <t:${Math.round(member.user.createdTimestamp / 1000)}>]` });
            }

            member.user.send({
                embeds: [{
                    title: `Welcome to ${member.guild.name}!`,
                    description: `Feel free to ask questions or communicate with other members. Have fun in our server! :)\n\n[Server invite](https://discord.gg/TYhSGhWGvm)\n[Invite Dolphin](https://discord.com/api/oauth2/authorize?client_id=713713873915478036&permissions=8&scope=bot)`,
                    color: "#2f3136"
                }]
            }).catch(() => {})
        }
    }
}