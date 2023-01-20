import { Event } from "../../structures/Events";
import { Client } from "../../structures/Client";
import { Guild } from "discord.js";

export default class extends Event {
    constructor(client: Client) {
        super(client, "guildCreate", false);
    }

    async execute(guild: Guild) {
        const config = this.client.configs.get(guild.id);
        if(!config) {
            await this.client.database.addGuild(guild.id);
            console.log(`Created a config for guild: ${guild.name}!`);
        }
    }
}