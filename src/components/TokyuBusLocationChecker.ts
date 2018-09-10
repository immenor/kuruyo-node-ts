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

export function keepCheckingBusLocation(stopName: string, waitTime: number, completion: {():void}) {
  getHTML("http://tokyu.bus-location.jp/blsys/navi?VID=rtl&EID=nt&PRM=&RAMK=116&SCT=1").then(function (html) {
    let locations = getLeftBusLocations(html)
    if (!checkIfBusIsAtStop(new Stop(stopName), locations)) {
      setTimeout(function(){
        keepCheckingBusLocation(stopName, waitTime, completion)
      }, waitTime)
    } else {
      completion()
    }
  }).catch(function(error) {
    console.log('error getting html', error)
  })
}
