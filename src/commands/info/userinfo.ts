import Command from "../../structures/Commands";
import { Client } from "../../handlers/ClientHandler";
import { Message, EmbedBuilder, ActivityType } from "discord.js";

export default class extends Command {
    constructor(client: Client) {
        super(client, "userinfo", {
            description: "Returns information about the user.",
            aliases: ["ui"],
            category: "Information",
        })
    }

    async execute(message: Message, args: any[]) {
        const statusMap = {
            online: "<:online:719630983648772198> Online",
            idle: "<:idle:719630983782989935> Idle",
            dnd: "<:dnd:719630983586119741> Do Not Disturb",
            offline: "<:invisible:719630983770406942> Offline"
        }

        const deviceMap = {
            desktop: "🖥️ Desktop",
            mobile: "📱 Mobile",
            web: "🌐 Browser"
        }

        const Badges = {
            HYPESQUAD_EVENTS: '<a:support:721625900260786238>',
            HOUSE_BRILLIANCE: '<:BrillianceLogo:717308501281734716>',
            HOUSE_BRAVERY: '<:BraveryLogo:717308501134671933>',
            HOUSE_BALANCE: '<:BalanceLogo:717308501117894696>',
            BUGHUNTER_LEVEL_1: '<:BugHunter:722891913190965268>',
            BUGHUNTER_LEVEL_2: '<:BugHunter:722891913190965268>',
            PARTNERED_SERVER_OWNER: '<:partneredServerOwner:851520583379451934>',
            EARLY_SUPPORTER: '<:DiscordEarlySupporter:718483343527772261>',
            DISCORD_PARTNER: '<:partner:722892221644537867>',
            SYSTEM: '<:Clyde:761313285194121216>',
            TEAM_USER: '<:dolphin_nitro:814097359423930378>',
            EARLY_VERIFIED_BOT_DEVELOPER: '<a:dolphin_verifiedDev:814097359712550942>',
            DISCORD_CERTIFIED_MODERATOR: '<:certifiedMod:851520583107477525>',
            VERIFIED_BOT: '<:verifiedbot:722892416058654780>'
        }

        const member = await this.client.utils.findMember(message, args, { allowAuthor: true })
        if(!member) return message.reply({ content: "Please, provide a mention/tag/id for this command."})

        let gifAvatar = member.user.avatarURL({ forceStatic: false });
    
        let badges = member.user.flags ? member.user.flags.toArray().map(flag => Badges[flag]).join(' ') : undefined;
    
        if(gifAvatar && gifAvatar.includes("gif")) {
          badges = badges + " <:dolphin_nitro:814097359423930378>"
        }

        const embed = new EmbedBuilder()
        .setColor("#2f3136")
        .setAuthor({
            name: `Information about ${member.displayName}`,
            iconURL: member.user.displayAvatarURL({ extension: "png", forceStatic: false })
        })
        .addFields([
            { name: "User", value: `${member.user.tag} ${badges}` },
            { name: "ID", value: `${member.user.id}` },
            { name: "Account Created", value: `<t:${Math.round(member.user.createdTimestamp / 1000)}:R>\n(<t:${Math.round(member.user.createdTimestamp / 1000)}>)`, inline: true },
            { name: "Joined The Guild", value: `<t:${Math.round(member.joinedTimestamp! / 1000)}:R>\n(<t:${Math.round(member.joinedTimestamp! / 1000)}>)`, inline: true },
        ])
        .setThumbnail(member.user.displayAvatarURL({ extension: "png", forceStatic: false, size: 2048 }))
        .setFooter({
            text: `Requested by ${message.author.tag}`,
            iconURL: message.author.displayAvatarURL({ extension: "png", forceStatic: false })
        })
        .setTimestamp()

        if(member.presence?.activities.length! > 0) {
            embed.setDescription(`${member.presence?.activities.map((a) => a.type == ActivityType.Custom ? `↳ **Custom Status**: ${a.emoji || ""} ${a.state}` : `↳ **${a.type}**: [${a.name}](${a.url})`).join("\n")}`)
        }

        if(member.presence && member.presence.status !== "offline") {
            embed.addFields({
                name: "Status", 
                value: `${statusMap[member.presence?.status!]} (${deviceMap[Object.keys(member.presence?.clientStatus!)[0]]})`
            })
        }

        return message.reply({ embeds: [embed] })
    }
}