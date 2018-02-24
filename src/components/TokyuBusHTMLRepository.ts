import rp = require('request-promise')
import cheerioModule = require('cheerio')


export interface HTMLRepository {
  getHTML(): Promise<CheerioSelector>
}

export class TokyuBusHTMLRepository implements HTMLRepository {

  public getHTML(): Promise<CheerioSelector> {
    var options = {
      uri: 'http://tokyu.bus-location.jp/blsys/navi?VID=rtl&EID=nt&PRM=&RAMK=116&SCT=1',
      transform: function (body: string) {
        return cheerioModule.load(body)
      }
    }

    return new Promise<CheerioSelector>(
      function (resolve, reject) {
        rp(options)
          .then((selector: CheerioSelector) => {
              resolve(selector)
          })
      })
  }
}
