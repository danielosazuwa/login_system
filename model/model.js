const mongoose = require("mongoose");

var loginSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const collection = mongoose.model("user", loginSchema);

module.exports = collection;
