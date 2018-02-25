import rp = require('request-promise')
import cheerioModule = require('cheerio')
import express = require('express')
import bodyParser = require('body-parser')

import { TokyuBusHTMLRepository } from "./components/TokyuBusHTMLRepository"
import { DefaultBusLocationFactory } from "./components/DefaultBusLocationFactory"
import { DefaultBusFactory } from "./components/DefaultBusFactory"
import { IOSNotificationSender } from "./components/IOSNotificationSender"

// Setup Express

const app = express()
const router = express.Router()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

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

  let sender = new IOSNotificationSender()

  sender.sendNotification(deviceToken, function() {
    res.send("done!")
  })
})

// Start Server

app.use('/api', router)
module.exports = app
app.listen(3000, () => console.log('Kuruyo Server listening on port 3000!'))
