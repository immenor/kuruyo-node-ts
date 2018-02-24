import { TokyuBusHTMLRepository } from "../src/components/TokyuBusHTMLRepository";
import { expect } from 'chai'
import 'mocha'

describe('Hello function', () => {
  const repo = new TokyuBusHTMLRepository()

  it('should return a html from the tokyu bus page', () => {
    return repo.getHTML().then(function(res) {
      expect(res).to.have.nested.property('html')
    })
  })

})
