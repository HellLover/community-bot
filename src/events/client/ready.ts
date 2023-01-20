import { Event } from "../../structures/Events";
import { Client } from "../../structures/Client";
import { ActivityType, Collection, Snowflake } from "discord.js";
import { GuildConfig } from "../../database/entities/Guild";

export default class extends Event {
    constructor(client: Client) {
        super(client, "ready", true);
    }

    async execute() {
        this.client?.user?.setActivity({ 
            name: "Dolphin's Squad", 
            type: ActivityType.Streaming, 
            url: "https://www.youtube.com/watch?v=gSo9E5FbbOg&ab_channel=Flameex" 
        })
        this.client?.logger?.log(`[CONNECTION] Connected as ${this.client?.user?.tag}!`);

        try {
            const guildsConfig = await this.client.database.getAllGuilds();
            if(!guildsConfig?.length) return;
            
            const configs = new Collection<Snowflake, GuildConfig>();
            guildsConfig?.forEach((conf) => configs.set(conf.guildId, conf))
    
            this.client.configs = configs;
        } catch(e) {
            this.client.logger.error(`Couldn't update guilds settings: ${e}`);
        }
    }
}