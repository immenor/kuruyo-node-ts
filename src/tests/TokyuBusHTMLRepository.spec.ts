import { TokyuBusHTMLRepository } from "../components/TokyuBusHTMLRepository";
import { expect } from 'chai'
import 'mocha'

describe('Tokyu Bus HTML Repository', () => {
  const repo = new TokyuBusHTMLRepository()

  it('should return a html from the tokyu bus page', () => {
    return repo.getHTML().then(function(res) {
      expect(res).to.have.nested.property('html')
    })
  })

})
