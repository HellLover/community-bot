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
    }
})

export type IUser = Document & UserData;

export interface UserData {
    _id: ObjectId,
    user_id: Snowflake,
    guild_id: Snowflake,
}

const Model = {
     collection: model("User", UserModel),
     name: "User"
}

export default Model;