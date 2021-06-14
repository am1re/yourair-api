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
                "h": { "$hour": "$timestamp" },
                "pm25": 1
            }
        },
        {
            $group: {
                _id: { "hour": "$h" },
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