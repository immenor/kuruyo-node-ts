import { getHTML } from "../src/components/TokyuBusHTMLRepository";
import { expect } from 'chai'
import 'mocha'

describe('Tokyu Bus HTML Repository', () => {

  it('should return a html from the tokyu bus page', () => {
    return getHTML("http://tokyu.bus-location.jp/blsys/navi?VID=rtl&EID=nt&PRM=&RAMK=116&SCT=1").then(function(res) {
      expect(res).to.have.nested.property('html')
    })
  })

})
