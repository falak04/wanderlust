const mongoose = require('mongoose');
const initdata = require('./data.js');
const Listing = require('../models/listing');

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
main()
  .then(() => {
    console.log('connected');
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
  await initDB();
}

const initDB = async () => {
  await Listing.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: '67fa811b159132b0822901d4',
  }));
  await Listing.insertMany(initdata.data);
  console.log('data');
};
