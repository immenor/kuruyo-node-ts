import { DefaultBusFactory } from "../src/components/DefaultBusFactory";
import { TokyuHTMLFixture } from "./TokyuHTMLFixture";
import { expect } from 'chai'
import 'mocha'

describe('Bus Factory', () => {
  const factory = new DefaultBusFactory()
  const html = new TokyuHTMLFixture().html()

  it('should find stops from the html', () => {
    let stops = factory.getStops(html)
    expect(stops[1].name).to.equal("恵比寿駅")
  })

})
