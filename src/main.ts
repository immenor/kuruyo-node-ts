import rp = require('request-promise')
import cheerioModule = require('cheerio')
import express = require('express')
import bodyParser = require('body-parser')

import { getHTML } from "./components/TokyuBusHTMLRepository"
import { getLeftBusLocations } from "./components/DefaultBusLocationFactory"
import { getStops, findStopByScanningDownFromStop } from "./components/DefaultBusFactory"
import { sendNotification } from "./components/IOSNotificationSender"
import { checkIfBusIsAtStop, keepCheckingBusLocation } from "./components/TokyuBusLocationChecker"
import { Stop } from "./components/stop"
import { getAllBuslines, BusLine } from "./components/busLineRepository"

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
  })

})

router.get('/get-stop-list', function(req, res) {
  let selectedLine: string = req.query["line"]
  let availableLines = getAllBuslines()

  let selectedLineIndex = availableLines.findIndex((line: BusLine, index: number, obj: BusLine[]): boolean => {
    if (selectedLine == line.name) {
      return true
    } else {
      return false
    }
  })

  let uri = availableLines[selectedLineIndex].uri

  console.log(uri)

  getHTML(uri).then(function(html) {
    // get list of all stops
    //res.json({ stops: locations })
  })
})

router.post('/target-bus-stop', function (req: express.Request, res: express.Response) {

  let targetStop = req.body["stop"]
  getHTML("http://tokyu.bus-location.jp/blsys/navi?VID=rtl&EID=nt&PRM=&RAMK=116&SCT=1").then(function (html) {
    let stop = findStopByScanningDownFromStop(3, targetStop, html)
    res.json({ stop: stop })
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
