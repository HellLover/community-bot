import * as DJS from 'discord.js';

import CommandHandler from "../handlers/CommandHandler";
import EventHandler from "../handlers/EventHandler";
import ClientUtils from '../utils/utils';
import { Database } from '../database/Database';
import { CacheStorage } from '../database/CacheStorage';
import { Logger } from '../utils/Logger';
import customEmojis from "../../assets/jsons/emojis.json";
import { QuickDB } from 'quick.db';
import { GuildConfig } from '#entities/Guild';

export class Client extends DJS.Client {
    private _commands = new DJS.Collection<any, any>();
    private _events = new DJS.Collection<any, any>();
    private _aliases = new DJS.Collection<any, any>();
    private _cooldowns = new Map<any, any>();
    private _configs = new DJS.Collection<DJS.Snowflake, Partial<GuildConfig>>();
    database: Database;
    cache: CacheStorage<any>;
    utils: ClientUtils;
    logger: Logger;
    customEmojis: typeof customEmojis;
    levels: QuickDB

    constructor() {
        super({
            intents: [
                DJS.GatewayIntentBits.GuildMembers,
                DJS.GatewayIntentBits.Guilds,
                DJS.GatewayIntentBits.GuildMessages,
                DJS.GatewayIntentBits.MessageContent,
                DJS.GatewayIntentBits.GuildPresences
            ],
            allowedMentions: { parse: ["roles", "everyone"], repliedUser: false }
        });

        this.utils = new ClientUtils(this);
        this.database = new Database(this);
        this.cache = new CacheStorage();
        this.logger = new Logger(null);
        this.customEmojis = customEmojis;
        this.levels = new QuickDB();
    }

    get commands() {
        return this._commands;
    }

    get aliases() {
        return this._aliases;
    }

    get events() {
        return this._events;
    }

    get cooldowns() {
        return this._cooldowns;
    }

    get configs() {
        return this._configs;
    }
    set configs(newConfig: DJS.Collection<DJS.Snowflake, Partial<GuildConfig>>) {
        this._configs = newConfig;
    }

    async register(token: string) {
        await this.database.connect();
        await super.login(token);
        await CommandHandler(this);
        await EventHandler(this)
    }

}