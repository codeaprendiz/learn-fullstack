/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */

const { MongoClient } = require('mongodb');

const CoinAPI = require("../CoinAPI");

class MongoBackend {
  constructor() {
    this.coinAPI = new CoinAPI();
    this.mongoUrl = 'mongodb://localhost:27017/maxcoin';
    this.client = null;
    this.collection = null;
  }

  async connect() {
    const mongoClient = new MongoClient(
      this.mongoUrl, {
        useUnifiedTopology: true, 
        useNewUrlParser: true
      } );
      console.log("Inside connect");
      this.client = await mongoClient.connect();
      this.collection = this.client.db("maxcoin").collection("values");
      return this.client;
  }

  async disconnect() {
    if(this.client) {
      return this.client.close();
    }
    return false;
  }

  async insert() {
    const data = await this.coinAPI.fetch();
    const documents = [];
    Object.entries(data.bpi).forEach((entry) => {
      documents.push({
        date : entry[0],
        value : entry[1],
      });
    });
    return this.collection.insertMany(documents);
  }

  async getMax() {}

  async max() {
    console.info("Connecting to MongoDB");
    console.time("mongodb-connect");
    const client = await this.connect();
    if (client.isConnected()) {
      console.info("Successfully connected to MongoDB");
    } else {
      throw new Error("Connecting to mongodb failed");
    }
    console.timeEnd("mongodb-connect");

    console.log("Inserting into mongo-db");
    console.time("mongodb-insert");
    const insertResult = await this.insert();
    console.timeEnd("mongodb-insert");

    console.log(`Number of documents inserted ${insertResult.result.n} into mongodb`)

    console.info("disconnecting to MongoDB");
    console.time("mongodb-disconnect");
    await this.disconnect();
    console.timeEnd("mongodb-disconnect");

  }
}

module.exports = MongoBackend;
