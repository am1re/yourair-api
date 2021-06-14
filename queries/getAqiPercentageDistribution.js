import StationValue from "../models/StationValue"

export default async (stationId, from, to) => {
    let queryTotalDocs = (from && to) ?
        { station_id: stationId, pm25: { $exists: true }, timestamp: { $lte: to, $gte: from } } :
        { station_id: stationId, pm25: { $exists: true } }

    let totalDocument = await StationValue.find(queryTotalDocs).countDocuments()

    totalDocument = totalDocument === 0 ? 1 : totalDocument

    console.log(totalDocument)

    let query = [
        {
            $match: {
                station_id: stationId,
                pm25: { $exists: true }
            }
        },
        {
            "$project": {
                "aqi": {
                    $cond:
                        [{ $lt: ["$pm25", 12] }, 1, {
                            $cond: [{ $lt: ["$pm25", 24] }, 2, {
                                $cond: [{ $lt: ["$pm25", 36] }, 3, {
                                    $cond: [{ $lt: ["$pm25", 42] }, 4, {
                                        $cond: [{ $lt: ["$pm25", 48] }, 5, {
                                            $cond: [{ $lt: ["$pm25", 54] }, 6, {
                                                $cond: [{ $lt: ["$pm25", 59] }, 7, {
                                                    $cond: [{ $lt: ["$pm25", 65] }, 8, {
                                                        $cond: [{ $lt: ["$pm25", 71] }, 9, 10]
                                                    }]
                                                }]
                                            }]
                                        }]
                                    }]
                                }]
                            }]
                        }]
                }
            }
        },
        {
            "$group": {
                "_id": { "aqi": "$aqi" },
                "count": { "$sum": 1 }
            }
        },
        {
            "$project": {
                "count": 1,
                "percentage": {
                    "$multiply": [{ "$divide": [100, totalDocument] }, "$count"]
                }
            }
        }]

    query[0] = (from && to) ? {
        $match: {
            station_id: stationId,
            pm25: { $exists: true },
            timestamp: {
                $lte: to,
                $gte: from
            }
        }
    } : query[0]

    return StationValue.aggregate(query)
}