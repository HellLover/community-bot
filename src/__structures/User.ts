import { User } from "discord.js";

exports = Object.defineProperties(User.prototype, {
    blacklisted: {
        value: false,
        writable: true,
        enumerable: false
    },
    isDev: {
        value: function isDeveloper() {
            return (this.id == "544225039470428160")
        }
    }
})