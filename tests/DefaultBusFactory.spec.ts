import { getStops, findStopByScanningDownFromStop } from "../src/components/DefaultBusFactory";
import { fakeHtml } from "./TokyuHTMLFixture";
import { expect } from 'chai'
import 'mocha'

describe('Bus Factory', () => {

  const html = fakeHtml()

  it('should find stops from the html', () => {
    let stops = getStops(html)
    expect(stops[1].name).to.equal("下通り五丁目")
  })

  it('should find a stop x stops away', () => {
    let stop = findStopByScanningDownFromStop(3, "守屋図書館", html)
    expect(stop.name).to.equal("下馬六丁目")
  })
})
