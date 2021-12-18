import * as envConfig from "dotenv";
envConfig.config();

import { Client } from "./handlers/ClientHandler";

const client = new Client({ intents: 4095 })

client.register(process.env.BOT_TOKEN as string);