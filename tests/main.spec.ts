var app = require('../src/main')
var chai = require('chai'), chaiHttp = require('chai-http')
chai.use(chaiHttp)
import 'mocha'
import * as sinon from 'sinon'
const expect = chai.expect

import * as IOSNotificationSender from "../src/components/IOSNotificationSender"
import * as TokyuBusHTMLRepository from "../src/components/TokyuBusHTMLRepository"
import * as TokyuBusLocationChecker from "../src/components/TokyuBusLocationChecker"
import { fakeHtml, fakeHtmlNoBuses } from "./TokyuHTMLFixture"
import { Promise } from 'es6-promise'

describe('Main Express Server', () => {

  let fakeHtmlRepo
  let fakeSender
  let fakeLocationChecker

  const prepareFakeHtml = function() {
    const promise = new Promise((resolve,reject) => {
      resolve(fakeHtml())
    })
    fakeHtmlRepo = sinon.stub(TokyuBusHTMLRepository, 'getHTML').returns(promise)
  }

  const prepareFakeHtmlWithNoBuses = function() {
    const promise = new Promise((resolve,reject) => {
      resolve(fakeHtmlNoBuses())
    })
    fakeHtmlRepo = sinon.stub(TokyuBusHTMLRepository, 'getHTML').returns(promise)
  }

  const setupDependencies = function() {
    fakeSender = sinon.stub(IOSNotificationSender, 'sendNotification').callsFake(function(token, completion) {
      completion()
    })
    fakeLocationChecker = sinon.stub(TokyuBusLocationChecker, 'keepCheckingBusLocation')
    .callsFake(function(uri, direction, stop, time, completion) {
      completion()
    })
  }

  before(function() {
    const promise = new Promise((resolve,reject) => {
      resolve(fakeHtml())
    })
    fakeHtmlRepo = sinon.stub(TokyuBusHTMLRepository, 'getHTML').returns(promise)
    fakeSender = sinon.stub(IOSNotificationSender, 'sendNotification').callsFake(function(token, completion) {
      completion()
    })
    fakeLocationChecker = sinon.stub(TokyuBusLocationChecker, 'keepCheckingBusLocation')
    .callsFake(function(uri, directions, stop, time, completion) {
      completion()
    })
  })

  after(function() {
    fakeHtmlRepo.restore()
    fakeSender.restore()
    fakeLocationChecker.restore()
  })

  it('should get left bus locations for 恵32', (done) => {
    chai.request(app)
      .get('/api/bus-locations')
      .query({line: '恵32', direction: 'left'})
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res).to.be.a('object')
        expect(res.body).to.have.property('busLocations')
        done()
    })
  })

  it('should get right bus locations for 恵32', (done) => {
    chai.request(app)
      .get('/api/bus-locations')
      .query({line: '恵32', direction: 'right'})
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res).to.be.a('object')
        expect(res.body).to.have.property('busLocations')
        done()
    })
  })

  it('should recieve a post with a deviceToken', (done) => {

    let body = {
        "line": "恵32",
        "direction": "left",
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

  describe('asking for the closest bus', () => {
    it('should send the stop and number of stops away for left buses', (done) => {
      chai.request(app)
        .get('/api/closest-bus')
        .query({line: '恵32', fromStop: '守屋図書館', toStop: '恵比寿駅'})
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res).to.be.a('object')
          expect(res.body['currentBusLocation']['busLocation']).to.equal('深沢不動前（駒沢通り')
          expect(res.body['currentBusLocation']['stopsAway']).to.equal('11')
          done()
      })
    })

    it('should send the stop and number of stops away for right buses', (done) => {
      chai.request(app)
        .get('/api/closest-bus')
        .query({line: '恵32', fromStop: '学芸附属中学校', toStop: '用賀駅'})
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res).to.be.a('object')
          expect(res.body['currentBusLocation']['busLocation']).to.equal('五本木')
          expect(res.body['currentBusLocation']['stopsAway']).to.equal('8')
          done()
      })
    })

    it('should send the root station when there is no closest left bus', (done) => {
      fakeHtmlRepo.restore()
      const promise = new Promise((resolve,reject) => {
        resolve(fakeHtmlNoBuses())
      })
      fakeHtmlRepo = sinon.stub(TokyuBusHTMLRepository, 'getHTML').returns(promise)

      chai.request(app)
        .get('/api/closest-bus')
        .query({line: '恵32', fromStop: '学芸附属中学校', toStop: '用賀駅'})
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res).to.be.a('object')
          expect(res.body['currentBusLocation']['busLocation']).to.equal('恵比寿駅')
          expect(res.body['currentBusLocation']['stopsAway']).to.equal('15')
          done()
      })
    })

    it('should send the root station when there is no closest right bus', (done) => {
      fakeHtmlRepo.restore()
      const promise = new Promise((resolve,reject) => {
        resolve(fakeHtmlNoBuses())
      })
      fakeHtmlRepo = sinon.stub(TokyuBusHTMLRepository, 'getHTML').returns(promise)

      chai.request(app)
        .get('/api/closest-bus')
        .query({line: '恵32', fromStop: '用賀神社前', toStop: '学芸附属中学校'})
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(res).to.be.a('object')
          expect(res.body['currentBusLocation']['busLocation']).to.equal('用賀駅')
          expect(res.body['currentBusLocation']['stopsAway']).to.equal('1')
          done()
      })
    })
  })
})
