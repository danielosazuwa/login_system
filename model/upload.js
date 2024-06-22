const mongoose = require("mongoose");

var uploadSchema = new mongoose.Schema({
  file: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const uploadCollection = mongoose.model("upload", uploadSchema);

module.exports = uploadCollection;
