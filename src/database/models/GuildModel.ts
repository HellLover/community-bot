import { model, Schema, SchemaTypes } from "mongoose";
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

const Model = {
     collection: model("Guild", GuildModel),
     name: "Guild"
}

export default Model;