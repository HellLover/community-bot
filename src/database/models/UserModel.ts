import { model, Schema, SchemaTypes, Document, ObjectId } from "mongoose";
import { Snowflake } from "discord.js";

const UserModel = new Schema({
    user_id: {
        type: SchemaTypes.String,
        required: true
    },
    guild_id: {
        type: SchemaTypes.String,
        required: true
    },
    economy: {
        bank: { type: SchemaTypes.Number, default: null },
        wallet: { type: SchemaTypes.Number, default: null },
        streak: {
            alltime: { type: SchemaTypes.Number, default: 0 },
            current: { type: SchemaTypes.Number, default: 0 },
            timestamp: { type: SchemaTypes.Number, default: 0 }
        }
    }
})

export type IUser = Document & UserData;

export interface UserData {
    _id: ObjectId,
    user_id: Snowflake,
    guild_id: Snowflake,
    economy: EconomyData
}

export interface EconomyData {
    bank: number | null,
    wallet: number | null,
    streak: {
        alltime: number,
        current: number,
        timestamp: number
    }
}

const Model = {
     collection: model("User", UserModel),
     name: "User"
}

export default Model;