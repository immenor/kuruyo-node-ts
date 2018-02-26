import{ Stop } from "./Stop"
import{ BusLocation } from "./BusLocation"

export function checkIfBusIsAtStop( stop: Stop, buslocations: BusLocation[] ):boolean {
    let foundMatch = false
    buslocations.forEach(function(location) {
      if (stop.name == location.stop.name) {
        foundMatch = true
      }
    })
    return foundMatch
}
