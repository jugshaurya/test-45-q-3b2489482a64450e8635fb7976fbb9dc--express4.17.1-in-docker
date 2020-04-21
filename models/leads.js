const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Rules
// - mobile number should be of 10 digits and unique
// - email should be unique
// - location should be enum ["Country", "City", "Zip"]
// - status should be enum ["Created", "Contacted"]
// can add time stamp but not required as not given in question

const leadSchema = new Schema({
  first_name: String,
  last_name: String,
  mobile: {
    type: Number,
    min: 10, // later
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  location_type: {
    type: String,
    enum: ["Country", "City", "Zip"],
  },
  status: {
    type: String,
    enum: ["Created", "Contacted"],
  },
  location_string: String,
  communication: {
    type: String,
    default: "",
  },
});

// lead becomes leads in mongodb db as a collection name
const Lead = mongoose.model("lead", leadSchema);
module.exports = Lead;
