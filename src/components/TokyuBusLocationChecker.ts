import{ Stop } from "./Stop"
import { BusLocation } from "./BusLocation"
import { getHTML } from "./TokyuBusHTMLRepository"
import { getLeftBusLocations } from "./DefaultBusLocationFactory"

export enum BusDirection {
  Left = 0,
  Right,
}

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

export function checkBusDirection(fromStop: string, toStop: string, allStops: Stop[]):BusDirection {
  let toStopIndex = indexForStop(toStop, allStops)
  let fromStopIndex = indexForStop(fromStop, allStops)

  if (fromStopIndex > toStopIndex) {
    return BusDirection.Left
  } else {
    return BusDirection.Right
  }
}

function indexForStop(stopName: string, allStops: Stop[]):number {
  return allStops.findIndex(
    (stop: Stop) => {
        return stop.name == stopName
    }
  )
}

export function findClosestLeftBusIndex(leftBuses: BusLocation[], fromStop: string, allStops: Stop[]):number {
    let closestBusIndex = -1
    let fromStopIndex = indexForStop(fromStop, allStops)

    for (var i = fromStopIndex; i < allStops.length; i++) {

      closestBusIndex = leftBuses.findIndex(
        (busLocation: BusLocation) => {
          return busLocation.stop.name == allStops[i].name
        }
      )

      if (closestBusIndex > 0) {
        break
      }
    }

    return closestBusIndex
}

export function findClosestRightBusIndex(rightBuses: BusLocation[], fromStop: string, allStops: Stop[]):number {
    let closestBusIndex = -1
    let fromStopIndex = indexForStop(fromStop, allStops)
    let i = fromStopIndex
    while(i--) {

      closestBusIndex = rightBuses.findIndex(
        (busLocation: BusLocation) => {
          return busLocation.stop.name == allStops[i].name
        }
      )

      if (closestBusIndex > 0) {
        break
      }
    }

    return closestBusIndex
}

export function numberOfStopsAway(direction: BusDirection, fromStop: string, closestStop: string, allStops: Stop[]):number {
  let fromStopIndex = indexForStop(fromStop, allStops)
  let indexOfClosestStopInMainArray = allStops.findIndex((stop: Stop) => {
    return stop.name == closestStop
  })

  if (direction == BusDirection.Left) {
    return indexOfClosestStopInMainArray - fromStopIndex
  } else {
    let range = allStops.slice(indexOfClosestStopInMainArray, fromStopIndex)
    return range.length
  }
}

export function closestRightBusStopName(rightBuses: BusLocation[], fromStop: string, closestBusIndex:number, allStops: Stop[]):string {
    if (closestBusIndex != -1) {
      return rightBuses[closestBusIndex].stop.name
    } else {
      return allStops[0].name
    }
}

export function closestLeftBusStopName(leftBuses: BusLocation[], fromStop: string, closestBusIndex:number, allStops: Stop[]):string {
    if (closestBusIndex != -1) {
      return leftBuses[closestBusIndex].stop.name
    } else {
      return allStops[allStops.length - 1].name
    }

}
