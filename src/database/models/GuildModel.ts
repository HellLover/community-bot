import { model, Schema, SchemaTypes } from "mongoose";
import { config } from "../../config";

const GuildModel = new Schema({
    id: {
        type: SchemaTypes.String,
        required: true
    },
    prefix: {
        type: SchemaTypes.String,
        required: false,
        default: config.prefix
    }
})

const Model = {
     collection: model("Guild", GuildModel),
     name: "Guild"
}

export default Model;