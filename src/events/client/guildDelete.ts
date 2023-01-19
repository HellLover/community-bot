import { Event } from "../../structures/Events";
import { Client } from "../../handlers/ClientHandler";
import { Guild } from "discord.js";

export default class extends Event {
    constructor(client: Client) {
        super(client, "guildDelete", false);
    }

    async execute(guild: Guild) {
        const config = this.client.configs.get(guild.id);
        if(config) {
            await this.client.database.deleteGuild(guild.id);
            console.log(`Deleted the config for guild: ${guild.name}!`);
        }
    }
}