import{ Stop } from "./Stop"
import { BusLocation } from "./BusLocation"
import { getHTML } from "./TokyuBusHTMLRepository"
import { getLeftBusLocations } from "./DefaultBusLocationFactory"

export function checkIfBusIsAtStop( stop: Stop, buslocations: BusLocation[] ):boolean {
    let foundMatch = false
    buslocations.forEach(function(location) {
      if (stop.name == location.stop.name) {
        foundMatch = true
      }
    })
    return foundMatch
}

export function keepCheckingBusLocation(stop: Stop, waitTime: number, completion: {():void}) {

  getHTML().then(function (html) {
    let locations = getLeftBusLocations(html)
    if (!checkIfBusIsAtStop(stop, locations)) {
      setTimeout(function(){
        keepCheckingBusLocation(stop, waitTime, completion)
      }, waitTime)
    } else {
      completion()
    }
  })
}
