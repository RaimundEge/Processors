import express, { json, urlencoded } from 'express';
import cors from 'cors';

import { getAll } from "./src/mongo.js";
import credit from './src/credit.js';
import order from "./src/order.js";
import getTemps from './src/temps.js'

const app = express();
var port = process.env.PORT || 3000; // default port to listen

// enable body parsing
app.use(json());
app.use(urlencoded({ extended: true }));

function logger(request, response, next) {
    const ip = request.headers["x-forwarded-for"] || request.connection.remoteAddress;
    console.log(new Date().toLocaleString() + " -- " + `${ip} ${request.method} ${request.path}`);
    next();
}
app.use(logger);
app.use(cors());

app.post("/creditcard", (request, response) => {
    credit(request, response);
});
app.get("/creditcard", (request, response) => {
    getAll("credit").then((docs) => response.send(docs));
});
app.post("/purchaseorder", (request, response) => {
    order(request, response);
});
app.get("/purchaseorder", (request, response) => {
    getAll("order").then((docs) => response.send(docs));
});
app.get("/refertemp", (request, response) => {
    getTemps(request, response);
});
// start the Express server
import os from 'os';
app.listen(port, () => {
    console.log("server started at " + os.hostname + ":%d", port);
});
