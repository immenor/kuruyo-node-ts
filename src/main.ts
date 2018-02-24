import rp = require('request-promise')
import cheerioModule = require('cheerio')
import apn = require('apn');

import { TokyuBusHTMLRepository } from "./components/TokyuBusHTMLRepository"
import { DefaultBusLocationFactory } from "./components/DefaultBusLocationFactory"
import { DefaultBusFactory } from "./components/DefaultBusFactory"

let htmlRepo = new TokyuBusHTMLRepository()

htmlRepo.getHTML().then(function (html) {
  let stop = new DefaultBusFactory().findStopByScanningDownFromStop(3, "守屋図書館", html)
  console.log("Target Bus Stop", stop)

  let locations = new DefaultBusLocationFactory().getLeftBusLocations(html)
  console.log("All Left Bus Locations:", locations)
})
