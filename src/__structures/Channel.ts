import { GuildChannel, EmbedBuilder } from "discord.js";

exports = Object.defineProperties(GuildChannel.prototype, {
    error: {
        value: function(...args) {
            try {
                const emoji = this.client.customEmojis['error'];
                const embed = new EmbedBuilder()
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
                const embed = new EmbedBuilder()
                  .setColor("#2f3136")
                  .setDescription(`${emoji} | ${args}`);
                return this.send({ embeds: [embed] })
            } catch(e) {
                return this.send({ embeds: [this.client.errorEmbed(e)] })
            }
        }
    }
})