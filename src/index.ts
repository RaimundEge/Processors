import express from "express";
import credit from "./credit";
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
app.post("/purchaseorder", (request, response) => {
    order(request, response);
});

// start the Express server
app.listen(port, () => {
    console.log("server started at http://localhost:%d", port);
});
