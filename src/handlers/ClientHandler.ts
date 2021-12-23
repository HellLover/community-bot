import * as DJS from 'discord.js';

import CommandHandler from "../handlers/CommandHandler";
import EventHandler from "../handlers/EventHandler";
import ClientUtils from '../utils/utils';
import { Database } from '../database/Database';
import { CacheStorage } from '../database/CacheStorage';
import { Logger } from '../utils/Logger';
import { config } from "../config";

export class Client extends DJS.Client {
    database: Database;
    cache: CacheStorage<any>;
    commands: DJS.Collection<any, any>;
    events: DJS.Collection<any, any>;
    aliases: DJS.Collection<any, any>;
    cooldowns: Map<any, any>;
    config: typeof config;
    utils: ClientUtils;
    logger: Logger;

    constructor(options: DJS.ClientOptions) {
        super(options);

        this.commands = new DJS.Collection();
        this.events = new DJS.Collection();
        this.aliases = new DJS.Collection();
        this.cooldowns = new Map();
        this.config = config;
        this.utils = new ClientUtils(this);
        this.database = new Database(this);
        this.cache = new CacheStorage();
        this.logger = new Logger(null);

    }

    async register(token: string) {
        super.login(token);
        CommandHandler(this);
        EventHandler(this)
        await this.database.connect();
    }

}