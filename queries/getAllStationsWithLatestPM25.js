import Station from "../models/Station"
import StationValue from "../models/StationValue"

export default () => {
    return StationValue.aggregate([
        { $match: { pm25: { $exists: true } } },
        { $group: { _id: "$station_id", pm25: { $last: "$pm25" } } },
        { $sort: { timestamp: -1 } },
        {
            $lookup:
            {
                from: Station.collection.name,
                localField: "_id",
                foreignField: "_id",
                as: "station"
            }
        },
        { $project: { _id: 1, pm25: 1, latitude: "$station.latitude", longitude: "$station.longitude" } },
    ])
}

// var mongoose = require('mongoose');

// export default () => {
//     return Station.aggregate([
//         {
//             $lookup:
//             {
//                 from: StationValue.collection.name,
//                 let: {
//                     stationId: "$_id"
//                 },
//                 pipeline: [
//                     {
//                         $match: {
//                             pm25: { $exists: true },
//                             $expr:
//                             {
//                                 $and:
//                                     [
//                                         { $eq: ["$station_id", "$$stationId"] }
//                                     ]
//                             }
//                         },
//                     },
//                     {
//                         $group: { _id: "$station_id", pm25: { $last: "$pm25" } }
//                     }
//                 ],
//                 as: "value"
//             },
//         }
//     ])
// }