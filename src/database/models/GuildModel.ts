import { Snowflake } from "discord.js";
import { model, Schema, SchemaTypes, Document, ObjectId } from "mongoose";
import { config } from "../../config";

const GuildModel = new Schema({
    id: {
        type: SchemaTypes.String,
        required: true
    },
    prefix: {
        type: SchemaTypes.String,
        default: config.prefix,
        required: false
    },
    custom_commands: { 
        type: SchemaTypes.Array,
        required: false,
        default: []
    },
    leveling: {
        type: SchemaTypes.Boolean,
        required: false,
        default: true
    }
})

export type IGuild = Document & GuildData;

export interface GuildData {
    id: string,
    prefix: string,
    custom_commands: CustomCommandData[],
    leveling: boolean
}

export interface CustomCommandData {
    name: string,
    response: string,
    author: Snowflake,
    createdAt: Date,
    description: string,
    visibility: "public" | "private"
}

const Model = {
     collection: model("Guild", GuildModel),
     name: "Guild"
}

export default Model;