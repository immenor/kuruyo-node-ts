import cheerioModule = require('cheerio')

export class Stop {
  name: string
  constructor(name: string) {
        this.name = name;
    }
}

export interface BusFactory {
  getStops(html: CheerioSelector): Stop[]
}

export class DefaultBusFactory {
  getStops(html: CheerioSelector): Stop[] {
    let stopNames: Stop[] = []
    html(".routeListTbl tr")
      .each(function( index: any ) {
        var stopName = html(this).find(".stopName a").text()
        let stop = new Stop(stopName)
        stopNames.push(stop)
      })
    return stopNames
  }
}
