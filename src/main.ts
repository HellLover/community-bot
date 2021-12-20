import * as envConfig from "dotenv";
envConfig.config();

import { Client } from "./handlers/ClientHandler";

const client = new Client({ 
    intents: 4095,
    partials: ["REACTION", "MESSAGE", "USER", "GUILD_MEMBER", "CHANNEL"],
    allowedMentions: { parse: ["roles", "everyone"], repliedUser: false }
 })

client.register(process.env.BOT_TOKEN as string);

client.database.on("ready", () => {
    console.log("Connected to database!")
})