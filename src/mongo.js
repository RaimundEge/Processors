import { MongoClient } from "mongodb";
import "./env.js";

const dbPromise = MongoClient.connect(process.env.MONGO_URL).then((client) => client.db(process.env.MONGO_DB));

async function find(collection, keys) {
  const db = await dbPromise;
  // console.log('checking: ' + collection, keys);
  const result = await db.collection(collection).findOne(keys);
  // console.log(result)
  return (result !== null);
}

async function insert(collection, data) {
  const db = await dbPromise;
  data.timeStamp = Date.now();
  const result = await db.collection(collection).insertOne(data);
  // console.log('done: ' + result.insertedCount + ' record inserted');
}

async function getAll(collection) {
  const db = await dbPromise;
  var compare = new Date();
  compare.setDate(compare.getDate() - 30);
  var search = {"timeStamp": { "$gt": compare.getTime()}}; 
  // console.log(search);
  const result = await db.collection(collection).find(search, {sort: [["timeStamp", "desc"]]}).toArray();
  // console.log(result);
  return result;
}

export { find, insert, getAll };