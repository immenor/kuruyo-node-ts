import rp = require('request-promise')
import cheerioModule = require('cheerio')
import apn = require('apn')
import express = require('express')
import bodyParser = require('body-parser')

import { TokyuBusHTMLRepository } from "./components/TokyuBusHTMLRepository"
import { DefaultBusLocationFactory } from "./components/DefaultBusLocationFactory"
import { DefaultBusFactory } from "./components/DefaultBusFactory"
import { APNCONFIG } from "../apn-config"

// Setup Express

const app = express()
const router = express.Router()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Setup APN

let apnConfig = new APNCONFIG()

let options = {
  token: {
    key: apnConfig.keyPath,
    keyId: apnConfig.keyId,
    teamId: apnConfig.teamId
  },
  production: false
}

var apnProvider = new apn.Provider(options)

// API Endpoints

let htmlRepo = new TokyuBusHTMLRepository()

router.get('/left-bus-locations', function(req, res) {

  htmlRepo.getHTML().then(function (html) {
    let locations = new DefaultBusLocationFactory().getLeftBusLocations(html)
    res.json({ busLocations: locations })
  })

})

router.post('/target-bus-stop', function (req: express.Request, res: express.Response) {

  let targetStop = req.body["stop"]
  htmlRepo.getHTML().then(function (html) {
    let stop = new DefaultBusFactory().findStopByScanningDownFromStop(3, targetStop, html)
    res.json({ stop: stop })
  })

})

router.post('/request-notification', function (req: express.Request, res: express.Response) {

  let targetStop = req.body["targetStop"]
  let stopsAway = req.body["stopAway"]
  let deviceToken = req.body["deviceToken"]

  let note = new apn.Notification()

  note.expiry = Math.floor(Date.now() / 1000) + 3600
  note.badge = 3
  note.alert = "Your bus is three stops away"
  note.payload = {'busLine':'恵32'}
  note.topic = "com.johnnylinnert.busping"

  apnProvider.send(note, deviceToken).then( (result) => {
    console.log('Result of push notification request', result)
    res.send("Notification Sent")
  })
})

// Start Server

app.use('/api', router)
module.exports = app
app.listen(3000, () => console.log('Kuruyo Server listening on port 3000!'))
