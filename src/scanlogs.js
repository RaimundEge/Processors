import { getLogRecords } from "./maria.js";

async function getScanLogRecords(request, response) {
    // process month count
    var month = 3;
    if (request.query.month !== undefined) {
        month = request.query.month
    }
    // query and wait
    var rows = await getLogRecords(month);
    console.log(rows.length + ' records found');
    response.send(rows);
    
}

export { getScanLogRecords };
