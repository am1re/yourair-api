import { Router } from 'express'
const router = Router()

import Station from "../models/Station"
import StationValue from "../models/StationValue"
import StationFetchInfo from "../models/StationFetchInfo"
import StationSource from "../models/StationSource"

import getAveragePM25Hourly from '../queries/getAveragePM25Hourly'
import getAveragePM25Weekly from '../queries/getAveragePM25Weekly'
import getAveragesStationValue from "../queries/getAveragesStationValue"
import getStationLatestPM25ById from '../queries/getStationLatestPM25ById'
import getAqiPercentageDistribution from '../queries/getAqiPercentageDistribution'

import getAllStationsWithLatestPM25 from '../queries/getAllStationsWithLatestPM25'

import pm25ToAqi from '../helpers/pm25ToAqi'
import seasonsDateRanges from '../helpers/seasonsDateRanges'

router.get('/stations', async (req, res, next) => {
  const stations = await Station.find()
  res.send(stations)
})

router.get('/stationsWithAqi', async (req, res, next) => {
  const stations = await getAllStationsWithLatestPM25()
  const result = stations.map(x => {
    x.latitude = x.latitude[0]
    x.longitude = x.longitude[0]
    x.aqi = pm25ToAqi(x.pm25)
    return x
  })
  res.send(result)
})

router.get('/station/:id/graphsData', async (req, res, next) => {
  const stationId = req.params.id

  const station = await Station.findOne({ _id: stationId }).catch(err => {
    console.log(err.message)
    res.status(404)
    res.send()
  })

  let stationDto = {
    id: station._id,
    timeline: [],
    diagrams: {
      total: {
        aqiWeekly: [],
        aqiByHours: [],
        aqiPercentage: []
      },
      winter: {
        aqiWeekly: [],
        aqiByHours: [],
        aqiPercentage: []
      },
      spring: {
        aqiWeekly: [],
        aqiByHours: [],
        aqiPercentage: []
      },
      summer: {
        aqiWeekly: [],
        aqiByHours: [],
        aqiPercentage: []
      },
      autumn: {
        aqiWeekly: [],
        aqiByHours: [],
        aqiPercentage: []
      }
    }
  }

  await fillTimeline(station._id, stationDto.timeline)
  await fillDiagrams(station._id, stationDto.diagrams)

  res.send(stationDto)
})

const fillDiagrams = async (stationId, diagrams) => {
  const seasons = { ...seasonsDateRanges, total: [null, null] }

  for (const season in seasons) {
    if (Object.hasOwnProperty.call(seasons, season)) {
      const dates = seasons[season];

      const aqiWeeklyBySeason = Array.from({ length: 7 }, () => 0)
      const aqiByHoursBySeason = Array.from({ length: 24 }, () => 0)
      const aqiPercentageBySeason = Array.from({ length: 10 }, () => 0)

      const weeklyValuesBySeason = await getAveragePM25Weekly(stationId, dates[0], dates[1])
      weeklyValuesBySeason.forEach(x => aqiWeeklyBySeason[x._id.week - 1] = pm25ToAqi(x.pm25))

      const hourlyValuesBySeason = await getAveragePM25Hourly(stationId, dates[0], dates[1])
      hourlyValuesBySeason.forEach(x => aqiByHoursBySeason[x._id.hour] = pm25ToAqi(x.pm25))

      const percAqiValuesBySeason = await getAqiPercentageDistribution(stationId, dates[0], dates[1])
      percAqiValuesBySeason.forEach(x => aqiPercentageBySeason[x._id.aqi - 1] = x.percentage)

      diagrams[season].aqiWeekly = aqiWeeklyBySeason
      diagrams[season].aqiByHours = aqiByHoursBySeason
      diagrams[season].aqiPercentage = aqiPercentageBySeason
    }
  }
}

const fillTimeline = async (stationId, timeline) => {
  const currentDate = new Date(Date.now())
  currentDate.setMinutes(0)
  currentDate.setSeconds(0)
  currentDate.setMilliseconds(0)

  for (let i = 0; i < 24; i++) {
    const to = new Date(currentDate - i * (60 * 60 * 1000))
    const from = new Date(currentDate - (i + 1) * (60 * 60 * 1000))
    const value = await getAveragesStationValue(stationId, to, from)
    timeline.push({ data: value[0] ?? null, from, to })
  }
}

export default router