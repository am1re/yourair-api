import { Schema, model } from "mongoose"
import uniqueValidator from "mongoose-unique-validator"

const schema = new Schema({
    station_id: { type: Schema.Types.ObjectId, ref: 'Station', unique: true },
    station_source: { type: Number, required: true },
    data: { type: String }
})

schema.plugin(uniqueValidator, { message: "is already exists." })

const newModel = model("StationFetchInfo", schema)

export default newModel