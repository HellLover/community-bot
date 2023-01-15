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
    xp: {
        type: SchemaTypes.Number,
        required: false,
        default: 0
    },
    level: {
        type: SchemaTypes.Number,
        required: false,
        default: 1
    },
})

export type IUser = Document & UserData;

export interface UserData {
    _id: ObjectId,
    user_id: Snowflake,
    guild_id: Snowflake,
    xp: number,
    level: number
}

const Model = {
     collection: model("User", UserModel),
     name: "User"
}

export default Model;