import StationValue from "../models/StationValue"

export default (stationId, from, to) => {
    let query = [
        {
            $match: {
                station_id: stationId,
            }
        },
        {
            "$project": {
                "w": { "$isoDayOfWeek": "$timestamp" },
                "pm25": 1
            }
        },
        {
            $group: {
                _id: { "week": "$w" },
                pm25: { $avg: "$pm25" },
            }
        }]

    query[0] = (from && to) ? {
        $match: {
            station_id: stationId,
            timestamp: {
                $lte: to,
                $gte: from
            }
        }
    } : query[0]

    return StationValue.aggregate(query)
}