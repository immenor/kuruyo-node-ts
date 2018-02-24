import cheerioModule = require('cheerio')
import { Stop } from "../components/stop"

export class BusLocation {
  stop: Stop
  constructor(stop: Stop) {
        this.stop = stop;
    }
}

export interface BusLocationFactory {
  getLeftBusLocations(html: CheerioSelector): BusLocation[]
}

export class DefaultBusLocationFactory implements BusLocationFactory {
  getLeftBusLocations(html: CheerioSelector): BusLocation[] {
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
}
