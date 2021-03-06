import path from "path";
import glob from "glob";

const EventHandler = (client) => {
    const events = glob.sync(`${process.cwd()}/src/events/**/*.ts`)
        for (const eventFile of events) {
            const { name } = path.parse(eventFile);
            const File = require(eventFile).default;
            const event = new File(client, name.toLowerCase());
            client.events.set(event.name, event);
            if(eventFile.includes("player")) {
                client.player.on(name, (...args) => event.execute(...args))
            } else if(event.once) {
                client.once(name, (...args) => event.execute(...args))
            } else {
                client.on(name, (...args) => event.execute(...args))
            }
        }
        client.logger.log(`[EVENTS] Loaded ${client.events.size} events!`)
    }

export default EventHandler;