import { Entity, Column, ObjectIdColumn } from "typeorm";

@Entity({ name: "USerConfig" })
export class UserConfig {
    @ObjectIdColumn()
    _id: string
    
    @Column()
    userId: string

    @Column()
    guildId: string
}