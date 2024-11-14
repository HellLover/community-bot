import "dotenv/config";

import "./__structures/Channel";
import "./__structures/User";

import { Client } from "./structures/Client";
import express from "express";

const client = new Client();

const app = express();
const PORT = process.env.PORT || 3000;

// Handle HTTP requests
app.get('/', (req, res) => res.send('Bot is running!'));

// Start the HTTP server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})

client.register(process.env.BOT_TOKEN as string);

client.database.on("ready", () => client.logger.log("[DATABASE] Connected to the database!"))