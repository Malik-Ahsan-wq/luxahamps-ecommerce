import { MongoClient, type MongoClientOptions } from "mongodb";

const uri =
  process.env.MONGODB_URI ??
  (process.env.NODE_ENV === "development" ? "mongodb://127.0.0.1:27017/luxahamps" : undefined);
const options: MongoClientOptions = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!uri) {
  throw new Error("MONGODB_URI is required in production environment");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
