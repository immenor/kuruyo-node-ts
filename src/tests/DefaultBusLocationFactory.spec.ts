import { DefaultBusLocationFactory } from "../components/DefaultBusLocationFactory"
import { TokyuHTMLFixture } from "./TokyuHTMLFixture"
import { expect } from 'chai'
import 'mocha'

describe('Bus Location Factory', () => {
  const factory = new DefaultBusLocationFactory()
  const html = new TokyuHTMLFixture().html()

  it('should get left bus locations', () => {
    let locations = factory.getLeftBusLocations(html)
    expect(locations[1].stop.name).to.equal("深沢不動前（駒沢通り")
  })

})
