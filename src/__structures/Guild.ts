import { Guild } from "discord.js";
import { GuildModel } from "../database/models/export/index";

exports = Object.defineProperties(Guild.prototype, {
    fetchSettings: {
        value: async function() {
            return await GuildModel.collection.findOne({ id: this.id });
        }
    }
})