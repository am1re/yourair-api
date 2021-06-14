import { Schema, model } from "mongoose"
import uniqueValidator from "mongoose-unique-validator"

const schema = new Schema({
    station_source_id: { type: Number, required: true, unique: true },
    name: String
})

schema.plugin(uniqueValidator, { message: "is already exists." })

const newModel = model("StationSource", schema)

export default newModel