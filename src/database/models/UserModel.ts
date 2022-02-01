import { model, Schema, SchemaTypes } from "mongoose";
import { config } from "../../config";

const UserModel = new Schema({
    id: {
        type: SchemaTypes.String,
        required: true
    },
})

const Model = {
     collection: model("User", UserModel),
     name: "User"
}

export default Model;