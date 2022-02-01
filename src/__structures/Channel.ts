import { Channel, MessageEmbed } from "discord.js";

exports = Object.defineProperties(Channel.prototype, {
    error: {
        value: function(...args) {
            try {
                const emoji = this.client.customEmojis['error'];
                const embed = new MessageEmbed()
                  .setColor("#2f3136")
                  .setDescription(`${emoji} | ${args}`);
                return this.send({ embeds: [embed] })
            } catch(e) {
                return this.send({ embeds: [this.client.errorEmbed(e)] })
            }
        }
    },

    success: {
        value: function(...args) {
            try {
                const emoji = this.client.customEmojis['success'];
                const embed = new MessageEmbed()
                  .setColor("#2f3136")
                  .setDescription(`${emoji} | ${args}`);
                return this.send({ embeds: [embed] })
            } catch(e) {
                return this.send({ embeds: [this.client.errorEmbed(e)] })
            }
        }
    }
})