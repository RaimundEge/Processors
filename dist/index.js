"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const credit_1 = __importDefault(require("./credit"));
const order_1 = __importDefault(require("./order"));
const app = express_1.default();
const port = 3000; // default port to listen
// enable body parsing
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
function logger(request, response, next) {
    const ip = request.headers["x-forwarded-for"] || request.connection.remoteAddress;
    console.log(new Date().toLocaleString() + " -- " + `${ip} ${request.method} ${request.path}`);
    next();
}
app.use(logger);
app.post("/creditcard", (request, response) => {
    credit_1.default(request, response);
});
app.post("/purchaseorder", (request, response) => {
    order_1.default(request, response);
});
// start the Express server
app.listen(port, () => {
    console.log("server started at http://localhost:%d", port);
});
//# sourceMappingURL=index.js.map