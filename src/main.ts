import * as envConfig from "dotenv";
envConfig.config();

import "./__structures/Guild";
import "./__structures/Channel";
import "./__structures/User";
import "./__structures/Message";

import { Client } from "./handlers/ClientHandler";

const client = new Client({ 
    intents: 4095,
    partials: ["REACTION", "MESSAGE", "USER", "GUILD_MEMBER", "CHANNEL"],
    allowedMentions: { parse: ["roles", "everyone"], repliedUser: false }
 })

client.register(process.env.BOT_TOKEN as string);

client.database.on("ready", () => {
    client.logger.log("[DATABASE] Connected to the database!")
})