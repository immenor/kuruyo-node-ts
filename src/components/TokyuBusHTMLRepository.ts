import rp = require('request-promise')
import cheerioModule = require('cheerio')

export function getHTML(uri: string): Promise<CheerioSelector> {
    var options = {
      uri: uri,
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
