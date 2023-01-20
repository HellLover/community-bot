import "dotenv/config";

import "./__structures/Channel";
import "./__structures/User";

import { Client } from "./structures/Client";

const client = new Client();

client.register(process.env.BOT_TOKEN as string);

client.database.on("ready", () => client.logger.log("[DATABASE] Connected to the database!"))