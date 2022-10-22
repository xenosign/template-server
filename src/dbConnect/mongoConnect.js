const { MongoClient, ServerApiVersion } = require('mongodb');

const DB_URI = process.env.DB_URI;
const DB_URI_ATLAS = process.env.DB_URI_ATLAS;

const uri = DB_URI_ATLAS;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

module.exports = client;
