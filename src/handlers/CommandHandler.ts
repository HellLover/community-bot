import path from "path";
import glob from "glob";

const CommandHandler = (client) => {
    const commands = glob.sync(`${process.cwd()}/src/commands/**/*.ts`)

        for (const commandFile of commands) {
            const { name } = path.parse(commandFile);
            const File = require(commandFile).default;
            const command = new File(client, name.toLowerCase());
            client.commands.set(command.name, command);
            if (command.aliases.length) {
                for (const alias of command.aliases) {
                    client.aliases.set(alias, command.name);
                }
            }
        }

    client.logger.log(`[COMMANDS] Loaded ${client.commands.size} commands!`)

}

export default CommandHandler;