"use strict";
exports.__esModule = true;
var rp = require("request-promise");
var cheerioModule = require("cheerio");
var TokyuBusHTMLRepository = (function () {
    function TokyuBusHTMLRepository() {
    }
    TokyuBusHTMLRepository.prototype.getHTML = function () {
        var options = {
            uri: 'http://tokyu.bus-location.jp/blsys/navi?VID=rtl&EID=nt&PRM=&RAMK=116&SCT=1',
            transform: function (body) {
                return cheerioModule.load(body);
            }
        };
        return new Promise(function (resolve, reject) {
            rp(options)
                .then(function (selector) {
                resolve(selector);
            });
        });
    };
    return TokyuBusHTMLRepository;
}());
exports.TokyuBusHTMLRepository = TokyuBusHTMLRepository;
//# sourceMappingURL=TokyuBusHTMLRepository.js.map