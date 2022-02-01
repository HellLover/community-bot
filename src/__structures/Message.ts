import { Message, TextChannel } from "discord.js";

exports = Object.defineProperties(Message.prototype, {
    prompt: {
        value: function(channel: TextChannel, options) {
            return new Promise(async (resolve) => {
                if (!options.filter) options.filter = () => true;
                const msg = await channel.send({ content: options.message });
                const collector = channel.createMessageCollector({ filter: options.filter, ...options.options });
    
                collector.on("end", (collected, reason) => {
                    if (options.delete && msg.deletable) msg.delete();
                    resolve(options.all ? collected : collected.first());
                });
            });
        }
    }
})