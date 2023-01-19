import "dotenv/config";

import "./__structures/Channel";
import "./__structures/User";

import { Client } from "./handlers/ClientHandler";

const client = new Client();

client.register(process.env.BOT_TOKEN as string);