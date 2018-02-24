"use strict";
exports.__esModule = true;
var TokyuBusHTMLRepository_1 = require("./components/TokyuBusHTMLRepository");
var htmlRepo = new TokyuBusHTMLRepository_1.TokyuBusHTMLRepository();
var html = htmlRepo.getHTML().then(function (selector) {
    selector(".routeListTbl tr")
        .each(function (index) {
        var stopName = selector(this).find(".stopName a").text();
        console.log(stopName);
    });
});
//# sourceMappingURL=main.js.map