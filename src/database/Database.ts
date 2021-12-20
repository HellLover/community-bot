import { connect, connection, Connection, disconnect, Model } from "mongoose";
import { EventEmitter } from "events";
import { Client } from "../handlers/ClientHandler";
import { Collection } from "discord.js";
import { GuildModel } from "./models/export/index";

export class Database extends EventEmitter {
    connection: Connection;
    models = new Collection<string, Model<any, any, any>>();
    client: Client;

    constructor(client: Client) {
        super()
        this.client = client;

        // Setting up the models
        this.models.set(GuildModel.name, GuildModel.collection);

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
}