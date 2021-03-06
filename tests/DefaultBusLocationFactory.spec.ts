import { getLeftBusLocations, getRightBusLocations } from "../src/components/DefaultBusLocationFactory"
import { fakeHtml } from "./TokyuHTMLFixture"
import { expect } from 'chai'
import 'mocha'

describe('Bus Location Factory', () => {

  const html = fakeHtml()

  it('should get left bus locations', () => {
    let locations = getLeftBusLocations(html)
    expect(locations[1].stop.name).to.equal("深沢不動前（駒沢通り")
  })

  it('should get right bus locations', () => {
    let locations = getRightBusLocations(html)
    expect(locations[1].stop.name).to.equal("五本木")
  })

})
