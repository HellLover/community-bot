import { connect, connection, Connection, disconnect, Model } from "mongoose";
import { EventEmitter } from "events";
import { Client } from "../handlers/ClientHandler";
import { Collection } from "discord.js";
import { GuildModel, UserModel } from "./models/export/index";
import { UserData } from "./models/UserModel";
import { GuildData } from "./models/GuildModel";

export class Database extends EventEmitter {
    connection: Connection;
    models = new Collection<string, Model<any, any, any>>();
    client: Client;

    constructor(client: Client) {
        super()
        this.client = client;

        // Setting up the models
        this.models.set(GuildModel.name, GuildModel.collection);
        this.models.set(UserModel.name, UserModel.collection);

        this.connection = connection;
        this.connection.on("open", this.emit.bind(this, "ready"));
    }

    connect() {
        return connect(process.env.MONGO_URL!, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
    }

    get state() {
        switch (this.connection.readyState) {
            case 1:
                return "connected";
            case 2:
                return "connecting";
            case 3:
                return "disconnecting";
            default:
                return "disconnected";
        }
    }

    get ready() {
        return this.state === "connected";
    }

    destroy() {
        return new Promise<void>((resolve, reject) => {
            if (!["disconnected", "disconnecting"].includes(this.state)) return resolve(disconnect(reject));
            resolve();
        });
    }

    async getGuild(guildId: string) {
        if(!guildId) console.warn("[Function: getGuildInDB]: Missing the guild ID.");
    
        try {
          let guild = await this.models.get("Guild")?.findOne({ id: guildId });
      
          if (!guild) {
            guild = await this.addGuild(guildId);
          }
      
          return guild;
        } catch (e) {
          console.error(e);
        }
    }

    async addGuild(guildId: string) {
        if(!guildId) console.warn("[Function: addGuild]: Missing the guild ID.");
    
        try {
          const guild = new GuildModel.collection({ id: guildId });
      
          await guild.save();
      
          return guild;
        } catch (e) {
          console.error(e);
        }
    }

    async updateGuild(guildId: string, settings: Partial<GuildData>) {
        if(!guildId) console.warn("[Function: updateGuildInDB]: Missing the guild ID.");
        if(!settings) console.warn("[Function: updateGuildInDB]: Missing the settings option.");
        
        try {
          if (typeof settings !== "object") {
            throw Error("'settings' must be an object");
          }
      
          // check if guild exists
          const guild = await this.getGuild(guildId);
      
          if (!guild) {
            await this.addGuild(guildId);
          }
      
          await this.models.get("Guild")?.findOneAndUpdate({ id: guildId }, settings);
        } catch (e) {
          console.error(e);
        }
    }

    async getUser(userId: string, guildId: string) {
      if(!userId) this.client.logger.warn("[Function: getUser]: Missing the user ID.");
      if(!guildId) this.client.logger.warn("[Function: getUser]: Missing the guild ID.")
    
        try {
          let user = await UserModel.collection.findOne({ user_id: userId, guild_id: guildId });
      
          if (!user) {
            user = await this.addUser(userId, guildId);
          }
      
          return user;
        } catch (e) {
          console.error(e);
        }
      }
      
      async addUser(userId: string, guildId: string) {
        if(!userId) this.client.logger.warn("[Function: addUser]: Missing the user ID.");
        if(!guildId) this.client.logger.warn("[Function: addUser]: Missing the guild ID.")
    
        try {
          const user = new UserModel.collection({ user_id: userId, guild_id: guildId });
      
          await user.save();
      
          return user;
        } catch (e) {
          console.error(e);
        }
      }
      
      async updateUser(userId: string, guildId: string, data: Partial<UserData>) {
        if(!userId) this.client.logger.warn("[Function: updateUser]: Missing the user ID.");
        if(!guildId) this.client.logger.warn("[Function: updateUser]: Missing the guild ID.");
        if(!data) this.client.logger.warn("[Function: updateUser]: Missing the data option.");
    
        try {
          if (typeof data !== "object") {
            throw Error("'data' must be an object");
          }
      
          const user = await this.getUser(userId, guildId);
      
          if (!user) {
            await this.addUser(userId, guildId);
          }
      
          await UserModel.collection.findOneAndUpdate({ user_id: userId, guild_id: guildId }, data);
        } catch (e) {
          console.error(e);
        }
      }
      
      async deleteUser(userId: string, guildId: string) {
        if(!userId) this.client.logger.warn("[Function: deleteUser]: Missing the user ID.");
        if(!guildId) this.client.logger.warn("[Function: deleteUser]: Missing the guild ID.");
        
        try {
          await UserModel.collection.findOneAndDelete({ user_id: userId, guild_id: guildId });
        } catch (e) {
          console.error(e);
        }
      }
}