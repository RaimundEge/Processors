import express from "express";
import credit from "./credit";
import { getAll } from "./mongo";
import order from "./order";

const app = express();
const port = 3000; // default port to listen

// enable body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function logger(request: express.Request, response: express.Response, next: any) {
    const ip = request.headers["x-forwarded-for"] || request.connection.remoteAddress;
    console.log(new Date().toLocaleString() + " -- " + `${ip} ${request.method} ${request.path}`);
    next();
}
app.use(logger);

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

// start the Express server
app.listen(port, () => {
    console.log("server started at http://localhost:%d", port);
});
