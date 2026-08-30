const mongoose = require("mongoose");

const initData = require("./data.js");

const Listing = require("../Models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});

    initData.data = initData.data.map((obj) => ({
        ...obj,
        image: obj.image.url,
        owner: "6a91d7b85df789486465d1c8"
    }));

    await Listing.insertMany(initData.data);

    console.log("data was initialized");
};

initDB();