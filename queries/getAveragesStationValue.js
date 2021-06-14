import StationValue from "../models/StationValue"

export default (stationId, to, from) => StationValue.aggregate([
    {
        $match: {
            station_id: stationId,
            timestamp: {
                $lte: to,
                $gte: from
            }
        }
    },
    {
        $group: {
            _id: "$station_id",
            temperature: { $avg: "$temperature" },
            humidity: { $avg: "$humidity" },
            pressure: { $avg: "$pressure" },
            pm10: { $avg: "$pm10" },
            pm25: { $avg: "$pm25" },
        }
    }])