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

  it('should return a html from the tokyu bus page', () => {

    let stop = new Stop("2")
    let locations = [
      new BusLocation(new Stop("2")),
      new BusLocation(new Stop("4")),
      new BusLocation(new Stop("6"))
    ]

    let isThreeStopsAway = TokyuBusLocationChecker.checkIfBusIsAtStop(stop, locations)
    expect(isThreeStopsAway).to.equal(true)

  })

  it('should run completion handler when it finds a matching stop', (done) => {
    var spy = sinon.spy(TokyuBusLocationChecker, "keepCheckingBusLocation")
    let stop = new Stop("2")
    TokyuBusLocationChecker.keepCheckingBusLocation(stop, 1, () => { done() })
    expect(spy.callCount).to.equal(1)
    spy.restore()
  })

}) 
