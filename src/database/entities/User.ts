import { Entity, Column, ObjectIdColumn } from "typeorm";

@Entity({ name: "user_config" })
export class UserConfig {
    @ObjectIdColumn()
    _id: string
    
    @Column()
    userId: string

    @Column()
    guildId: string
}