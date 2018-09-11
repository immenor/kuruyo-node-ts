import cheerioModule = require('cheerio')
import { Stop } from "../components/Stop"
import { BusLocation } from "../components/BusLocation"

export function getLeftBusLocations(html: CheerioSelector): BusLocation[] {
    let leftBusses: BusLocation[] = []

    html(".routeListTbl tr")
      .each(function( index: number, element: CheerioElement ) {

        let row = html(this).find(".balloonL").find("img")
        if (row.length > 0) {
          let stopName = html(this).next().find('.stopName a').text()
          let stop = new Stop(stopName)
          let location = new BusLocation(stop)
          leftBusses.push(location)
        }

    })

  return leftBusses
}

export function getRightBusLocations(html: CheerioSelector): BusLocation[] {
    let rightBusses: BusLocation[] = []

    html(".routeListTbl tr")
      .each(function( index: number, element: CheerioElement ) {

        let row = html(this).find(".balloonR").find("img")
        if (row.length > 0) {
          let stopName = html(this).next().find('.stopName a').text()
          let stop = new Stop(stopName)
          let location = new BusLocation(stop)
          rightBusses.push(location)
        }

    })

  return rightBusses
}
