import { check } from "./maria.js";
import { find, insert } from "./mongo.js";

export default async (request, response) => {
    // console.log(request.body);
    const poData = request.body;
    let errors = checkRequired(poData);

    // check in mariadb for customer
    if (errors.length === 0) {
        errors = await check(poData);
    }
    if (errors.length === 0) {
        if (await find("order", poData)) {
            errors.push("transaction already exists");
        }
    }
    if (errors.length === 0) {
        // processDay is some random days from now
        const oldDate = new Date();
        const wait = Math.floor(20 + Math.random() * 40);
        const newDate = new Date(oldDate.getFullYear(), oldDate.getMonth(), oldDate.getDate() + wait);
        poData.processDay = newDate.getFullYear() + "/" + (newDate.getMonth() + 1) + "/" + newDate.getDate() ;
        // compute commission
        poData.commission = Math.round(Math.random() * 15.0 + 4) + "%";
        await insert("order", poData);
    }
    if (errors.length > 0) {
        poData.errors = errors;
    }
    response.send(poData);
};

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
