import { EmbedBuilder, MessageCollectorOptionsParams, GuildTextBasedChannel } from "discord.js";

export interface EmbedPaginateOptions {
    channel: GuildTextBasedChannel,
    pages: EmbedBuilder[],
    timeout?: number,
    backEmoji?: string,
    stopEmoji?: string,
    forwardEmoji?: string,
    filter?: MessageCollectorOptionsParams<any>
}