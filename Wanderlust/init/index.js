const mongoose = require("mongoose");
const Listing = require("../models/listing");
const sampleData = require("./data");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then((res) => console.log("Connected to database"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

async function initDB() {
  await Listing.deleteMany({});
  sampleData.data = sampleData.data.map((obj) => ({ ...obj, owner: "68b083701b32b1b22ff8afbe" }));
  await Listing.insertMany(sampleData.data);
  console.log("Sample data was saved to DB");
}

initDB();
