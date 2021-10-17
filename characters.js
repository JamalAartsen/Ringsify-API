const mongoose = require("mongoose");

const characterSchema = new mongoose.Schema({
    name: String,
    imageUrl: String,
    description: String,
    race: String,
    birth: String,
    death: String,
    realm: String,
    culture: String,
    fandomUrl: String
}, { versionKey: false });

module.exports = mongoose.model("Character", characterSchema);