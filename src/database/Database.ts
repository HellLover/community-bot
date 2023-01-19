import { DataSource } from "typeorm";
import { EventEmitter } from "events";
import { Client } from "../handlers/ClientHandler";
import { UserConfig } from "./entities/User";
import { GuildConfig } from "./entities/Guild";

export class Database extends EventEmitter {
    client: Client;
    private readonly dataSource: DataSource;

    constructor(
      client: Client, 
    ) {
        super()

        this.client = client;
        this.dataSource = new DataSource({
          type: "mongodb",
          url: process.env["MONGO_URL"],
          logging: true,
          synchronize: true,
          entities: [UserConfig, GuildConfig],
          useUnifiedTopology: true,
          useNewUrlParser: true
        })
    }

    connect() {
        return this.dataSource.initialize()
          .then(() => this.client.logger.log("[DATABASE] Connected to the database!"))
          .catch((err) => this.client.logger.error(`[DATABASE_ERROR]: ${err}`))
    }

    async getAllGuilds() {
        try {
          const data = await this.dataSource.manager.find(GuildConfig);
          return data;
        } catch(e) {
          this.client.logger.error("An error occured while trying to get all guilds data.")
        }
    }

    async addGuild(guildId: string | undefined) {
      try { 
        if(!guildId) return null;

        const guild = new GuildConfig();
        guild.guildId = guildId;
    
        await this.dataSource.manager.save(guild);
        this.client.configs.set(guildId, guild);
    
        return guild;
      } catch(e) {
        this.client.logger.error(e)
      }
    }

    async getGuild(guildId: string | undefined) {
      if(!guildId) return null;
  
      try {
        let guild = await this.dataSource.manager.findOne(GuildConfig, { where: { guildId } });
        if(!guild) {
          // @ts-expect-error ignore
          guild = await this.addGuild(guildId);
        }
    
        return guild;
      } catch (e) {
        console.error(e);
      }
    }

    async updateGuild(guildId: string | undefined, settings: Partial<GuildConfig>) {
      if(!guildId) return null;
      
      try {
        if (typeof settings !== "object") {
          throw Error("'settings' must be an object");
        }
    
        // check if guild exists
        const guild = await this.getGuild(guildId);
    
        if (!guild) {
          await this.addGuild(guildId);
        }
    
        await this.dataSource.manager.update(GuildConfig, { guildId }, settings);
        this.client.configs.set(guildId, {
          ...guild,
          ...settings
        });

      } catch (e) {
        console.error(e);
      }
    }

    async deleteGuild(guildId: string | undefined) {
      if(!guildId) return null;
      
      try {
        await this.dataSource.manager.delete(GuildConfig, { guildId });
        this.client.configs.delete(guildId);
      } catch (e) {
        console.error(e);
      }
    }

    async addUser(userId: string, guildId: string | undefined) {
      if(!guildId) return null;
  
      const user = new UserConfig()
      user.guildId = guildId;
      user.userId = userId;
  
      await this.dataSource.manager.save(user);
  
      return user;
    }

    async getUser(userId: string, guildId: string | undefined) {
      if(!guildId) return null;
    
      try {
        let user = await this.dataSource.manager.findOne(UserConfig, { where: { userId } });
    
        if (!user) {
          user = await this.addUser(userId, guildId);
        }
    
        return user;
      } catch (e) {
        console.error(e);
      }
    }

    async updateUser(userId: string, guildId: string | undefined, data: Partial<UserConfig>) {
    
      try {
        if (typeof data !== "object") {
          throw Error("'data' must be an object");
        }
    
        const user = await this.getUser(userId, guildId);
    
        if (!user) {
          await this.addUser(userId, guildId);
        }
    
        await this.dataSource.manager.update(UserConfig, { userId, guildId }, data);

      } catch (e) {
        console.error(e);
      }
    }

    async deleteUser(userId: string, guildId: string | undefined) {
      if(!guildId) return null;
      
      try {
        await this.dataSource.manager.delete(UserConfig, { userId, guildId });
      } catch (e) {
        console.error(e);
      }
    }
}