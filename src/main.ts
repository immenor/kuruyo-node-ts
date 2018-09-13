import rp = require('request-promise')
import cheerioModule = require('cheerio')
import express = require('express')
import bodyParser = require('body-parser')

import { getHTML } from "./components/TokyuBusHTMLRepository"
import { getLeftBusLocations, getRightBusLocations } from "./components/DefaultBusLocationFactory"
import { getStops, findStopByScanningDownFromStop } from "./components/DefaultBusFactory"
import { sendNotification } from "./components/IOSNotificationSender"
import { checkIfBusIsAtStop, keepCheckingBusLocation, checkBusDirection, BusDirection, findClosestLeftBusIndex, findClosestRightBusIndex, numberOfStopsAway, closestRightBusStopName, closestLeftBusStopName } from "./components/TokyuBusLocationChecker"
import { Stop } from "./components/stop"
import { BusLine, getBusline } from "./components/busLineRepository"
import { BusLocation} from "./components/BusLocation"

// Setup Express

const app = express()
const router = express.Router()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// API Endpoints

router.get('/left-bus-locations', function(req, res) {
  getHTML("http://tokyu.bus-location.jp/blsys/navi?VID=rtl&EID=nt&PRM=&RAMK=116&SCT=1").then(function (html) {
    let locations = getLeftBusLocations(html)
    res.json({ busLocations: locations })
  }).catch(function(error) {
    console.log('error getting html', error)
    res.status(500).send('error getting scraping html')
  })
})

router.get('/get-stop-list', function(req, res) {
  let selectedLine: string = req.query["line"]
  let busLine = getBusline(selectedLine)
  let uri = busLine.uri

  getHTML(uri).then(function(html) {
    let stops = getStops(html)
    res.json({ stops: stops })
  }).catch(function(error) {
    console.log('error getting html', error)
    res.status(500).send('error getting scraping html')
  })
})

router.get('/closest-bus', function(req, res) {
  let selectedLine: string = req.query["line"]
  let busLine = getBusline(selectedLine)
  let uri = busLine.uri

  let toStopString: string = req.query['toStop']
  let fromStopString: string = req.query['fromStop']

  getHTML(uri).then(function(html) {
    let stops = getStops(html)
    let leftBusLocation = getLeftBusLocations(html)
    let rightBusLocation = getRightBusLocations(html)
    let busDirection = checkBusDirection(fromStopString, toStopString, stops)

    let closestBusStopName: string
    let stopsAway: number

    if (busDirection == BusDirection.Left) {
      let closestBusIndex = findClosestLeftBusIndex(leftBusLocation, fromStopString, stops)
      closestBusStopName = closestLeftBusStopName(leftBusLocation, fromStopString, closestBusIndex, stops)
      stopsAway = numberOfStopsAway(busDirection, fromStopString, closestBusStopName, stops)
    } else {
      let closestBusIndex = findClosestRightBusIndex(rightBusLocation, fromStopString, stops)
      closestBusStopName = closestRightBusStopName(rightBusLocation, fromStopString, closestBusIndex, stops)
      stopsAway = numberOfStopsAway(busDirection, fromStopString, closestBusStopName, stops)
    }

    res.json({
      currentBusLocation: { busLocation: closestBusStopName , stopsAway: String(stopsAway)}
    })

  }).catch(function(error) {
    console.log('error getting html', error)
    res.status(500).send('error getting scraping html')
  })
})

router.post('/target-bus-stop', function (req: express.Request, res: express.Response) {
  let targetStop = req.body["stop"]

  getHTML("http://tokyu.bus-location.jp/blsys/navi?VID=rtl&EID=nt&PRM=&RAMK=116&SCT=1").then(function (html) {
    let stop = findStopByScanningDownFromStop(3, targetStop, html)
    res.json({ stop: stop })
  }).catch(function(error) {
    console.log('error getting html', error)
    res.status(500).send('error getting scraping html')
  })
})

router.post('/request-notification', function (req: express.Request, res: express.Response) {
  let targetStop = req.body["targetStop"]
  let stopsAway = req.body["stopAway"]
  let deviceToken = req.body["deviceToken"]

  console.log("Checking Bus Location for Target Stop:", targetStop, "For Device:", deviceToken)

  keepCheckingBusLocation(targetStop, 3000, () => {
    sendNotification(deviceToken, function() {
      console.log("Found Bus & Sent Notification To:", deviceToken)
    })
  })
  res.sendStatus(200)
})

// Start Server

app.use('/api', router)
module.exports = app
app.listen(process.env.PORT || 3000, () => console.log('Kuruyo Server Up & Running'))
