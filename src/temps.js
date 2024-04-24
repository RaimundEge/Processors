import { getAllWine } from "./mongo.js";

export default async (request, response) => {
    const range = request.query.range;
    
    if (range == undefined) {
        response.send("range is missing");
    } else {
        console.log('Range: ' + range);
        var docs = await getAllWine(range);
        console.log(docs.length + ' temp records retrieved');
        response.send(docs);
    }
};