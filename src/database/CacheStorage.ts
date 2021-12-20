import { Collection } from "discord.js";

class CacheStorage<V = any> {
    data: Collection<string, any>;

    constructor() {
        this.data = new Collection();
    }

    set(key: string, value: any) {
        this.data.set(key, value);

        return this;
    }

    get(key: string): V {
        return this.data.get(key);
    }

    has(key: string) {
        return this.data.has(key);
    }

    delete(key: string) {
        return this.data.delete(key);
    }

    clear() {
        this.data.clear();
    }
}

export { CacheStorage };