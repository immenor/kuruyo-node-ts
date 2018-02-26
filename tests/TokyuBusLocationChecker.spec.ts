import { checkIfBusIsAtStop } from "../src/components/TokyuBusLocationChecker"
import { Stop } from "../src/components/Stop"
import { BusLocation } from "../src/components/BusLocation"
import { expect } from 'chai'
import 'mocha'

describe('Tokyu Bus Location Checker', () => {

  it('should return a html from the tokyu bus page', () => {

    let stop = new Stop("2")
    let locations = [
      new BusLocation(new Stop("2")),
      new BusLocation(new Stop("4")),
      new BusLocation(new Stop("6"))
    ]

    let isThreeStopsAway = checkIfBusIsAtStop(stop, locations)
    expect(isThreeStopsAway).to.equal(true)

  })

}) 
