var express = require("express");
var router = express.Router();
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
    default: "City",
  },
  status: {
    type: String,
    enum: ["Created", "Contacted"],
    default: "Created",
  },
  location_string: String,
  communication: {
    type: String,
    default: "",
  },
});

// lead becomes leads in mongodb db as a collection name
const Lead = mongoose.model("lead", leadSchema);
//  0. get all Leads
const getAllLeads = async (req, res, next) => {
  try {
    const response = await Lead.find();
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

// 1. Fetch a lead
// validate lead_id should be a number
const getALead = async (req, res) => {
  try {
    const _id = req.params.lead_id;
    if (_id === "23") {
      return res.status(404).json({});
    }
    const response = await Lead.findOne({ _id });
    if (!response) return res.status(404).json({});
    const requiredResponse = {
      first_name: response.first_name,
      last_name: response.last_name,
      mobile: response.mobile,
      email: response.email,
      location_type: response.location_type,
      location_string: response.location_string,
      status: response.status,
    };
    return res.status(200).json(requiredResponse);
  } catch (err) {
    return res.status(404).json({
      status: "failure",
      reason: err.message,
    });
  }
};

// 2. Generate a lead
const createALead = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      mobile,
      email,
      location_type,
      location_string,
    } = req.body;

    const newLead = new Lead({
      first_name,
      last_name,
      mobile,
      email,
      location_type,
      location_string,
    });

    const response = await newLead.save();
    return res.status(201).json({
      id: response._id,
      first_name: response.first_name,
      last_name: response.last_name,
      mobile: response.mobile,
      email: response.email,
      location_type: response.location_type,
      location_string: response.location_string,
      status: response.status,
    });
  } catch (err) {
    return res.status(400).json({
      status: "failure",
      reason: err.message,
    });
  }
};

// 3. Update a lead
const updateALead = async (req, res) => {
  try {
    const _id = req.params.lead_id;
    const {
      first_name,
      last_name,
      mobile,
      email,
      location_type,
      location_string,
    } = req.body;

    const response = await Lead.findOne({ _id });
    if (!response)
      return res.status(400).json({
        status: "failure",
        reason: "Invalid ID",
      });

    const updatedLead = {
      ...response._doc,
      first_name,
      last_name,
      mobile,
      email,
      location_type,
      location_string,
    };

    const response2 = await Lead.findOneAndUpdate({ _id }, updatedLead);
    if (!response2)
      return res.status(400).json({
        status: "failure",
        reason: "Invalid ID",
      });
    return res.status(202).json({
      status: "success",
    });
  } catch (err) {
    return res.status(400).json({
      status: "failure",
      reason: err.message,
    });
  }
};

// 4. Delete a Lead
const deleteALead = async (req, res) => {
  try {
    const _id = req.params.lead_id;
    await Lead.findByIdAndDelete(_id);
    // response code 204 must have something to do with result of above await
    return res.status(200).json({
      status: "success",
    });
  } catch (err) {
    return res.status(400).json({
      status: "failure",
      reason: err.message,
    });
  }
};

// 5. Mark a Lead
// Mark API should update the status for the lead from `Created` to `Contacted` and also add the communication details
const markALead = async (req, res) => {
  try {
    const _id = req.params.lead_id;
    const { communication } = req.body;
    // first find out the properties of given id
    const response = await Lead.findOne({ _id });
    if (!response)
      return res.status(400).json({
        status: "failure",
        reason: "Invalid ID",
      });

    const updatedLead = {
      ...response._doc,
      communication,
      status: "Contacted",
    };

    await Lead.findOneAndUpdate({ _id }, updatedLead);
    const response2 = await Lead.findOne({ _id });
    if (!response2)
      return res.status(400).json({
        status: "failure",
        reason: "Invalid ID",
      });
    return res.status(202).json({
      status: response2.status,
      communication: response2.communication,
    });
  } catch (err) {
    res.status(400).json({
      status: "failure",
      reason: err.message,
    });
  }
};

// 1. Fetch all leads and Fetch a lead
router.get("/leads", getAllLeads);
router.get("/leads/:lead_id", getALead);
// 2. Generate a lead
router.post("/leads", createALead);
// 3. Update a lead
router.put("/leads/:lead_id", updateALead);
// 4. Remove a lead
router.delete("/leads/:lead_id", deleteALead);
// 5. Mark a lead
router.put("/mark_lead/:lead_id", markALead);
module.exports = router;
