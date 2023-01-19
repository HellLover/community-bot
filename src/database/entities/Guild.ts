import { Entity, Column, ObjectIdColumn } from "typeorm";

interface CustomCommandData {
    name: string,
    response: string,
    author: string,
    createdAt: Date,
    description: string | null,
    visibility: string
}

@Entity({ name: "guild_config" })
export class GuildConfig {
    @ObjectIdColumn()
    _id: string
    
    @Column()
    guildId: string

    @Column()
    prefix: string = "k!"

    @Column()
    customCommands: CustomCommandData[] = []

    @Column()
    leveling: boolean = false
}