const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");

main()
  .then((res) => {
    console.log("connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust_proj");
}

const initDb = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "66d35283daa4a0b0d2a763d2",
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialised");
};

initDb();
