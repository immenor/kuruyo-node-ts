import cheerioModule = require('cheerio')
import { Stop } from "../components/Stop"

export function getStops(html: CheerioSelector): Stop[] {
    let stopNames: Stop[] = []
    html(".routeListTbl tr")
      .each(function( index: any ) {
        var stopName = html(this).find(".stopName a").text()
        if (stopName !== '') {
          let stop = new Stop(stopName)
          stopNames.push(stop)
        }
      })
    return stopNames
}

export function findStopByScanningDownFromStop(numberOfStops: number, fromStop: string, html: CheerioSelector):Stop {
    let stops = this.getStops(html)

    let i = stops.findIndex(function (stop: Stop) {
      return stop.name == fromStop
    })

    return stops[i + numberOfStops]
}
