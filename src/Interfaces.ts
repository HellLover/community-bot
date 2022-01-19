import { TextChannel, MessageEmbed, CollectorFilter } from "discord.js";

export interface EmbedPaginateOptions {
    channel: TextChannel,
    pages: MessageEmbed[],
    timeout?: number,
    backEmoji?: string,
    stopEmoji?: string,
    forwardEmoji?: string,
    filter?: CollectorFilter<any>
}