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
const mongodb_1 = require("mongodb");
const dbPromise = mongodb_1.MongoClient.connect("mongodb://localhost:27017", { useNewUrlParser: true, useUnifiedTopology: true }).then((client) => client.db("csci467"));
function find(collection, keys) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield dbPromise;
        // console.log('checking: ' + collection, keys);
        const result = yield db.collection(collection).findOne(keys);
        // console.log(result)
        return (result !== null);
    });
}
exports.find = find;
function insert(collection, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield dbPromise;
        const result = yield db.collection(collection).insertOne(data);
        // console.log('done: ' + result.insertedCount + ' record inserted');
    });
}
exports.insert = insert;
//# sourceMappingURL=mongo.js.map