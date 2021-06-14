import { Schema, model } from "mongoose"

const schema = new Schema({
    latitude: { type: String, minlength: 1, maxlength: 32, required: true },
    longitude: { type: String, minlength: 1, maxlength: 32, required: true },
    altitude: { type: String, minlength: 1, maxlength: 32, },
})

schema.index({ latitude: 1, longitude: 1 });

const newModel = model("Station", schema)

export default newModel