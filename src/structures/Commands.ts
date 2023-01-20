import { PermissionResolvable } from "discord.js";
import { Client } from "../structures/Client";

interface CommandOptions {
    name?: string;
    description?: string;
    usage?: string;
    aliases?: string[];
    category?: string;
    examples?: string[];
    memberPermission?: PermissionResolvable[];
    botPermission?: PermissionResolvable[];
    cooldown?: number;
    ownerOnly?: boolean;
}

export default class Command {
    client: Client;
    name: string;
    description: string | null;
    usage: string | null;
    aliases: any[];
    category: string | null;
    examples?: string[];
    memberPermission: any[];
    botPermission: any[];
    cooldown: number| null;
    ownerOnly: boolean;

    constructor(client: Client, name: string, options: CommandOptions) {
        this.client = client;
        this.name = options.name || name;
        this.description = options.description || null;
        this.usage = options.usage || null;
        this.aliases = options.aliases || [];
        this.category = options.category || null;
        this.examples = options.examples || [];
        this.memberPermission = options.memberPermission || [];
        this.botPermission = options.botPermission || [];
        this.cooldown = options.cooldown || null;
        this.ownerOnly = options.ownerOnly || false;
    }

}