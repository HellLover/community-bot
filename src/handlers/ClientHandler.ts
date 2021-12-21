import * as DJS from 'discord.js';

import CommandHandler from "../handlers/CommandHandler";
import EventHandler from "../handlers/EventHandler";
import ClientUtils from '../utils/utils';
import { Database } from '../database/Database';
import { CacheStorage } from '../database/CacheStorage';
import { config } from "../config";

export class Client extends DJS.Client {
    database: Database;
    cache: CacheStorage<any>;
    commands: Map<any, any>;
    events: Map<any, any>;
    aliases: Map<any, any>;
    cooldowns: Map<any, any>;
    config: typeof config;
    utils: ClientUtils;

    constructor(options: DJS.ClientOptions) {
        super(options);

        this.commands = new Map();
        this.events = new Map();
        this.aliases = new Map();
        this.cooldowns = new Map();
        this.config = config;
        this.utils = new ClientUtils(this);
        this.database = new Database(this);
        this.cache = new CacheStorage();

    }

    async register(token: string) {
        super.login(token);
        CommandHandler(this);
        EventHandler(this)
        await this.database.connect();
    }

}