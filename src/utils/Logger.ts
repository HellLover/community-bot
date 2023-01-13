import util from "node:util";
import chalk from "chalk";

const output = (msg: string) => `[${new Date().toLocaleString()}] | ${msg}`;

class Logger extends console.Console {
    constructor(output?: NodeJS.WritableStream | null) {
        super({
            stdout: output ?? process.stdout
        });
    }

    log(message: any) {
        super.log(chalk.cyan(output(typeof message === "string" ? message : util.inspect(message))))
    }

    warn(message: any) {
        super.warn(chalk.yellow(output(typeof message === "string" ? message : util.inspect(message))))
    }

    error(message: any) {
        super.error(chalk.red(output(typeof message === "string" ? message : util.inspect(message))))
    }

}

export { Logger };