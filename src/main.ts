import rp = require('request-promise')
import cheerioModule = require('cheerio')
import apn = require('apn');

import { TokyuBusHTMLRepository } from "./components/TokyuBusHTMLRepository";

let htmlRepo = new TokyuBusHTMLRepository()
let html = htmlRepo.getHTML().then(function (selector) {
  selector(".routeListTbl tr")
    .each(function( index: any ) {
      var stopName = selector(this).find(".stopName a").text()
      console.log(stopName)
    })
})
