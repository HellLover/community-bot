import { Event } from "../../structures/Events";
import { Client } from "../../handlers/ClientHandler";

export default class extends Event {
    constructor(client: Client) {
        super(client, "ready", true);
    }

    async execute() {
        this.client?.user?.setActivity("Dolphin's Squad", { type: "STREAMING", url: "https://www.youtube.com/watch?v=gSo9E5FbbOg&ab_channel=Flameex" })
        this.client?.logger?.log(`[CONNECTION] Connected as ${this.client?.user?.tag}!`)
    }
}