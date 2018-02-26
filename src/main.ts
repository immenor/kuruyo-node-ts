import rp = require('request-promise')
import cheerioModule = require('cheerio')
import express = require('express')
import bodyParser = require('body-parser')

import { getHTML } from "./components/TokyuBusHTMLRepository"
import { getLeftBusLocations } from "./components/DefaultBusLocationFactory"
import { getStops, findStopByScanningDownFromStop } from "./components/DefaultBusFactory"
import { sendNotification } from "./components/IOSNotificationSender"

// Setup Express

const app = express()
const router = express.Router()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// API Endpoints

router.get('/left-bus-locations', function(req, res) {

  getHTML().then(function (html) {
    let locations = getLeftBusLocations(html)
    res.json({ busLocations: locations })
  })

})

router.post('/target-bus-stop', function (req: express.Request, res: express.Response) {

  let targetStop = req.body["stop"]
  getHTML().then(function (html) {
    let stop = findStopByScanningDownFromStop(3, targetStop, html)
    res.json({ stop: stop })
  })

})

router.post('/request-notification', function (req: express.Request, res: express.Response) {

  let targetStop = req.body["targetStop"]
  let stopsAway = req.body["stopAway"]
  let deviceToken = req.body["deviceToken"]


  // For Now + 30 min, Try to find a bus three stops away

  sendNotification(deviceToken, function() {
    res.sendStatus(200)
  })
})

// Start Server

app.use('/api', router)
module.exports = app
app.listen(3000, () => console.log('Kuruyo Server listening on port 3000!'))
