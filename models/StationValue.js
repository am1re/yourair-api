import { Schema, model } from "mongoose"

const schema = new Schema({
    station_id: { type: Schema.Types.ObjectId, ref: 'Station', required: true, index: true },
    timestamp: { type: Date, minlength: 1, maxlength: 32, required: true },
    temperature: { type: Number, minlength: 1, maxlength: 32 },
    pressure: { type: Number, minlength: 1, maxlength: 32 },
    humidity: { type: Number, minlength: 1, maxlength: 32 },
    pm25: { type: Number, minlength: 1, maxlength: 32, index: true },
    pm10: { type: Number, minlength: 1, maxlength: 32 },
})

const newModel = model("StationValue", schema)

export default newModel