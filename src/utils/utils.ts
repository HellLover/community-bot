import { Client } from "../handlers/ClientHandler";

export default class ClientUtils {
    client: Client

    constructor(client) {
        this.client = client;
    }

    missingPerms(member, perms) {
        const missingPerms = member.permissions.missing(perms)
        .map(str => `\`${str.replace(/_/g, ' ').toLowerCase().replace(/\b(\w)/g, char => char.toUpperCase())}\``);
    
        return missingPerms.length > 1 ?
        `${missingPerms.slice(0, 1).join(", ")} and ${missingPerms.slice(-1)[0]}` :
        missingPerms[0];
    }
}