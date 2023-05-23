const { MongoClient, ServerApiVersion } = require("mongodb");

let cachedClient = null;
let cachedDatabase = null;

module.exports = {
  async getMongoConnection() {

    if (cachedDatabase) {
      return cachedDatabase;
    }

    const client = new MongoClient(process.env.MONGO_SERVER_URL, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    const db = client.db(process.env.MONGO_DATABASE);

    cachedClient = client;
    cachedDatabase = db;
    return db;
  }
}

