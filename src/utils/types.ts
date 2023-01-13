import { TextChannel, EmbedBuilder, MessageCollectorOptionsParams } from "discord.js";

export interface EmbedPaginateOptions {
    channel: TextChannel,
    pages: EmbedBuilder[],
    timeout?: number,
    backEmoji?: string,
    stopEmoji?: string,
    forwardEmoji?: string,
    filter?: MessageCollectorOptionsParams<any>
}