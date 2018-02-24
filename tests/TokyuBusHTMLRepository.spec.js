"use strict";
exports.__esModule = true;
var TokyuBusHTMLRepository_1 = require("../src/components/TokyuBusHTMLRepository");
var chai_1 = require("chai");
require("mocha");
describe('Tokyu Bus HTML Repository', function () {
    var repo = new TokyuBusHTMLRepository_1.TokyuBusHTMLRepository();
    it('should return a html from the tokyu bus page', function () {
        return repo.getHTML().then(function (res) {
            chai_1.expect(res).to.have.nested.property('html');
        });
    });
});
//# sourceMappingURL=TokyuBusHTMLRepository.spec.js.map