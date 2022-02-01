import express from "express";
import cors from "cors";
import { Client } from "../handlers/ClientHandler";
import { readdirSync } from "fs";
import { Commands } from "./routes/commands";

const app = express();

export const App = async (client: Client) => {
    const routes = (await readdirSync('./src/http/routes')).filter((v, i, a) => a.indexOf(v) === i),
                   endpoints = ["commands"];

    for (const route of routes) {
            if (route !== 'index.ts') {
                app.use(`/${route.replace('.ts', '')}`, Commands(client));
            }
    }

    app
        .use(cors())
        .disable('x-powered-by')
        .get('/', (req, res) => {
            res
                .type('text/plain')
                .send([
                        `API server for ${client.user?.tag}`,
                        'Endpoints:',
                        endpoints.join('\n'),
                ].join('\n'));
        })

    .get('*', async function(req, res) {
        res.send('Nothing here!');
    })

    .listen("0808", () => {
        client.logger.log(`[SERVER] Starting a server on port 0808.`);
    })

    .on('error', (err) => {
        client.logger.error(`Error with starting HTTP API: ${err.message}`);
    });
}