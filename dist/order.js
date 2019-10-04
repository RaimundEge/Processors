"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const maria_1 = require("./maria");
const mongo_1 = require("./mongo");
exports.default = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(request.body);
    const poData = request.body;
    let errors = checkRequired(poData);
    // check in mariadb for customer
    if (errors.length === 0) {
        errors = yield maria_1.check(poData);
    }
    if (errors.length === 0) {
        if (yield mongo_1.find("order", poData)) {
            errors.push("transaction already exists");
        }
    }
    if (errors.length === 0) {
        // processDay is some random days from now
        const oldDate = new Date();
        const wait = Math.floor(25 + Math.random() * 40);
        const newDate = new Date(oldDate.getFullYear(), oldDate.getMonth(), oldDate.getDate() + wait);
        poData.processDay = newDate.getFullYear() + "/" + (newDate.getMonth() + 1) + "/" + newDate.getDate();
        // compute commission
        poData.commission = Math.floor(Math.random() * 24.0 + 3) + "%";
        yield mongo_1.insert("order", poData);
    }
    if (errors.length > 0) {
        poData.errors = errors;
    }
    response.send(poData);
});
function checkRequired(poData) {
    const errors = [];
    if (!("custid" in poData)) {
        errors.push("customer id missing");
    }
    if (!("order" in poData)) {
        errors.push("order number missing");
    }
    if (!("associate" in poData)) {
        errors.push("associate id missing");
    }
    if (!("amount" in poData)) {
        errors.push("purchase amount missing");
    }
    return errors;
}
//# sourceMappingURL=order.js.map