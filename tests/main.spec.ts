var app = require('../src/main')
var chai = require('chai'), chaiHttp = require('chai-http')
chai.use(chaiHttp)
import 'mocha'
import * as sinon from 'sinon'
const expect = chai.expect

import * as IOSNotificationSender from "../src/components/IOSNotificationSender"
import * as TokyuBusHTMLRepository from "../src/components/TokyuBusHTMLRepository"
import { fakeHtml } from "./TokyuHTMLFixture"
import { Promise } from 'es6-promise'

describe('Main Express Server', () => {

  let fakeHtmlRepo
  let fakeSender

  before(function() {
    const promise = new Promise((resolve,reject) => {
      resolve(fakeHtml())
    })
    fakeHtmlRepo = sinon.stub(TokyuBusHTMLRepository, 'getHTML').returns(promise)
    fakeSender = sinon.stub(IOSNotificationSender, 'sendNotification').callsFake(function(token, completion) {
      completion()
    })
  })

  after(function() {
    fakeHtmlRepo.restore()
    fakeSender.restore()
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
})
