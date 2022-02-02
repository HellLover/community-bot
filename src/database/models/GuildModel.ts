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
        default: [],
    },
})

export type IGuild = Document & GuildData;

export interface GuildData {
    _id: ObjectId,
    prefix: string,
    custom_commands: CustomCommandData[]
}

export interface CustomCommandData {
    name: string,
    response: string
}

const Model = {
     collection: model("Guild", GuildModel),
     name: "Guild"
}

export default Model;