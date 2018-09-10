var app = require('../src/main')
var chai = require('chai'), chaiHttp = require('chai-http')
chai.use(chaiHttp)
import 'mocha'
import * as sinon from 'sinon'
const expect = chai.expect

import * as IOSNotificationSender from "../src/components/IOSNotificationSender"
import * as TokyuBusHTMLRepository from "../src/components/TokyuBusHTMLRepository"
import * as TokyuBusLocationChecker from "../src/components/TokyuBusLocationChecker"
import { fakeHtml } from "./TokyuHTMLFixture"
import { Promise } from 'es6-promise'

describe('Main Express Server', () => {

  let fakeHtmlRepo
  let fakeSender
  let fakeLocationChecker

  before(function() {
    const promise = new Promise((resolve,reject) => {
      resolve(fakeHtml())
    })
    fakeHtmlRepo = sinon.stub(TokyuBusHTMLRepository, 'getHTML').returns(promise)
    fakeSender = sinon.stub(IOSNotificationSender, 'sendNotification').callsFake(function(token, completion) {
      completion()
    })
    fakeLocationChecker = sinon.stub(TokyuBusLocationChecker, 'keepCheckingBusLocation')
    .callsFake(function(stop, time, completion){
      completion()
    })
  })

  after(function() {
    fakeHtmlRepo.restore()
    fakeSender.restore()
    fakeLocationChecker.restore()
  })

  it('should respond to a get for all left busses', (done) => {
    let body = {
      stop: "守屋図書館"
    }

    chai.request(app)
      .post('/api/target-bus-stop')
      .send(body)
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('stop')
        done()
    })

  })

  it('should get left bus locations', (done) => {
    chai.request(app)
      .get('/api/left-bus-locations')
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res).to.be.a('object')
        expect(res.body).to.have.property('busLocations')
        done()
    })
  })

  it('should recieve a post with a deviceToken', (done) => {

    let body = {
        "targetStop": "守屋図書館",
        "stopsAway": 3,
        "deviceToken": "123456789"
    }

    chai.request(app)
      .post('/api/request-notification')
      .send(body)
      .end((err, res) => {
        expect(res).to.have.status(200)
        done()
    })
  })

  it('should send a list of stops for a specific line', (done) => {

    chai.request(app)
      .get('/api/get-stop-list')
      .query({line: '恵32'})
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res).to.be.a('object')
        expect(res.body).to.have.property('stops')
        expect(res.body["stops"].length).to.equal(25)
        done()
    })
  })

  it('should send the closest bus location and the number of stops away from your current location', (done) => {

    chai.request(app)
      .get('/api/closest-bus')
      .query({line: '恵32', fromStop: '守屋図書館', toStop: '恵比寿駅'})
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res).to.be.a('object')
        expect(res.body['currentBusLocation']['busLocation']).to.equal('深沢不動前（駒沢通り')
        expect(res.body['currentBusLocation']['stopsAway']).to.equal('5')
        done()
    })

  })
})
