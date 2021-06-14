import StationValue from "../models/StationValue"

// export default (stationId) => StationValue.find(
//     {
//         station_id: stationId,
//         pm25: { $exists: true }
//     },
//     'pm25',
//     {
//         sort: { 'timestamp': -1 }
//     }).limit(1)

export default (stationId) => StationValue.findOne(
    {
        station_id: stationId,
        pm25: { $exists: true }
    },
    'pm25',
    {
        sort: { 'timestamp': -1 }
    });