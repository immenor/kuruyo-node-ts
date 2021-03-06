import { Stop } from "../src/components/Stop"
import { BusLocation } from "../src/components/BusLocation"
import { expect } from 'chai'
import 'mocha'
import * as sinon from 'sinon'

import * as TokyuBusLocationChecker from "../src/components/TokyuBusLocationChecker"
import * as TokyuBusHTMLRepository from "../src/components/TokyuBusHTMLRepository"
import * as DefaultBusLocationFactory from "../src/components/DefaultBusLocationFactory"
import { fakeHtml } from "./TokyuHTMLFixture"
import { Promise } from 'es6-promise'
import { BusLine, getBusline } from "../src/components/busLineRepository"
import { BusDirection } from "../src/components/TokyuBusLocationChecker"

describe('Tokyu Bus Location Checker', () => {

  let fakeHtmlRepo
  let fakeLocationFactory

  before(function() {
    const promise = new Promise((resolve,reject) => {
      resolve(fakeHtml())
    })

    let matchingLocations = [
      new BusLocation(new Stop("2"))
    ]

    fakeHtmlRepo = sinon.stub(TokyuBusHTMLRepository, 'getHTML').returns(promise)
    fakeLocationFactory = sinon.stub(DefaultBusLocationFactory, 'getLeftBusLocations').returns(matchingLocations)
  })

  after(function() {
    fakeHtmlRepo.restore()
    fakeLocationFactory.restore()
  })

  it('should check if a bus is at the stop', () => {

    let stop = new Stop("2")
    let locations = [
      new BusLocation(new Stop("2")),
      new BusLocation(new Stop("4")),
      new BusLocation(new Stop("6"))
    ]

    let busIsAtStop = TokyuBusLocationChecker.checkIfBusIsAtStop(stop, locations)
    expect(busIsAtStop).to.equal(true)

  })

  it('should run completion handler when it finds a matching stop on the left side', (done) => {
    var spy = sinon.spy(TokyuBusLocationChecker, "keepCheckingBusLocation")
    let stop = new Stop("2")
    let busLine = getBusline("恵32")

    TokyuBusLocationChecker.keepCheckingBusLocation(busLine.uri, BusDirection.Left, stop.name, 1, () => { done() })
    expect(spy.callCount).to.equal(1)
    spy.restore()
  })

}) 
