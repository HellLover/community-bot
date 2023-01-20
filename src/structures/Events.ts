import { Client } from "../structures/Client";

export abstract class Event {
    client: Client;
    name: string;
    once: boolean;

    constructor(client: Client, name: string, once: boolean = false) {
        this.client = client;
        this.name = name;
        this.once = once;
    }

    abstract execute(...args: any[]): Promise<any>;

};