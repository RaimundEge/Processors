import { MongoClient } from "mongodb";
import "./env";

const dbPromise: Promise<any> = MongoClient.connect(process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true }).then((client) => client.db(process.env.MONGO_DB));

async function find(collection: string, keys: object) {
  const db = await dbPromise;
  // console.log('checking: ' + collection, keys);
  const result = await db.collection(collection).findOne(keys);
  // console.log(result)
  return (result !== null);
}

async function insert(collection: string, data: any) {
  const db = await dbPromise;
  data.timeStamp = Date.now();
  const result = await db.collection(collection).insertOne(data);
  // console.log('done: ' + result.insertedCount + ' record inserted');
}

async function getAll(collection: string) {
  const db = await dbPromise;
  const result = await db.collection(collection).find({}, {limit: 20, sort: [["timeStamp", "desc"]]}).toArray();
  // console.log(result);
  return result;
}

export { find, insert, getAll };
