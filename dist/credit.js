"use strict";
/* tslint:disable */
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
const mongo_1 = require("./mongo");
exports.default = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(request.body);
    const ccData = request.body;
    const errors = checkRequired(ccData);
    if (errors.length === 0) {
        errors.push(...checkNumber(ccData.cc));
        if (errors.length === 0) {
            ccData.brand = ccBrand(ccData.cc);
        }
        errors.push(...checkExp(ccData.exp));
    }
    if (errors.length === 0) {
        if (yield mongo_1.find("credit", ccData)) {
            errors.push("transaction already exists");
        }
    }
    if (errors.length === 0) {
        ccData.authorization = Math.floor((Math.random() * 10000) + 10000) + "";
        yield mongo_1.insert("credit", ccData);
    }
    if (errors.length > 0) {
        ccData.errors = errors;
    }
    response.send(ccData);
});
function checkRequired(ccData) {
    const errors = [];
    if (!("name" in ccData)) {
        errors.push("card holder name missing");
    }
    if (!("vendor" in ccData)) {
        errors.push("vendor id missing");
    }
    if (!("trans" in ccData)) {
        errors.push("transaction number missing");
    }
    if (!("cc" in ccData)) {
        errors.push("card number missing");
    }
    if (!("exp" in ccData)) {
        errors.push("card expiration missing");
    }
    if (!("amount" in ccData)) {
        errors.push("transaction amount missing");
    }
    return errors;
}
function checkNumber(value) {
    // returns true on valid number
    // accept only digits, dashes or spaces
    if (/[^0-9-\s]+/.test(value)) {
        return ["credit card number contains invalid characters"];
    }
    // The Luhn Algorithm. It's so pretty.
    let nCheck = 0;
    let bEven = false;
    value = value.replace(/\D/g, "");
    for (let n = value.length - 1; n >= 0; n--) {
        const cDigit = value.charAt(n);
        let nDigit = parseInt(cDigit, 10);
        if (bEven) {
            if ((nDigit *= 2) > 9) {
                nDigit -= 9;
            }
        }
        nCheck += nDigit;
        bEven = !bEven;
    }
    return ((nCheck % 10) === 0) ? [] : ["credit card number is invalid"];
}
function ccBrand(cur_val) {
    let sel_brand;
    // the regular expressions check for possible matches as you type, hence the OR operators based on the number of chars
    // regexp string length {0} provided for soonest detection of beginning of the card numbers this way it could be used for BIN CODE detection also
    // JCB
    const jcb_regex = new RegExp("^(?:2131|1800|35)[0-9]{0,}$"); // 2131, 1800, 35 (3528-3589)
    // American Express
    const amex_regex = new RegExp("^3[47][0-9]{0,}$"); // 34, 37
    // Diners Club
    const diners_regex = new RegExp("^3(?:0[0-59]{1}|[689])[0-9]{0,}$"); // 300-305, 309, 36, 38-39
    // Visa
    const visa_regex = new RegExp("^4[0-9]{0,}$"); // 4
    // MasterCard
    const mastercard_regex = new RegExp("^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)[0-9]{0,}$"); // 2221-2720, 51-55
    const maestro_regex = new RegExp("^(5[06789]|6)[0-9]{0,}$"); // always growing in the range: 60-69, started with / not something else, but starting 5 must be encoded as mastercard anyway
    // Discover
    const discover_regex = new RegExp("^(6011|65|64[4-9]|62212[6-9]|6221[3-9]|622[2-8]|6229[01]|62292[0-5])[0-9]{0,}$");
    //// 6011, 622126-622925, 644-649, 65
    // get rid of anything but numbers
    cur_val = cur_val.replace(/\D/g, "");
    // checks per each, as their could be multiple hits
    // fix: ordering matter in detection, otherwise can give false results in rare cases
    if (cur_val.match(jcb_regex)) {
        sel_brand = "jcb";
    }
    else if (cur_val.match(amex_regex)) {
        sel_brand = "amex";
    }
    else if (cur_val.match(diners_regex)) {
        sel_brand = "diners_club";
    }
    else if (cur_val.match(visa_regex)) {
        sel_brand = "visa";
    }
    else if (cur_val.match(mastercard_regex)) {
        sel_brand = "mastercard";
    }
    else if (cur_val.match(discover_regex)) {
        sel_brand = "discover";
    }
    else if (cur_val.match(maestro_regex)) {
        if (cur_val[0] === "5") { // started 5 must be mastercard
            sel_brand = "mastercard";
        }
        else {
            sel_brand = "maestro"; // maestro is all 60-69 which is not something else, thats why this condition in the end
        }
    }
    else {
        sel_brand = "unknown";
    }
    return sel_brand;
}
function checkExp(value) {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const fields = value.split("/");
    if (fields.length !== 2 || isNaN(Number(fields[0])) || isNaN(Number(fields[1])) || Number(fields[0]) > 12) {
        return (["expiration date invalid"]);
    }
    if (Number(fields[1]) < year || Number(fields[1]) === year && Number(fields[0]) < month) {
        return (["card expired"]);
    }
    return [];
}
//# sourceMappingURL=credit.js.map