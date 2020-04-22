var express = require("express");
var router = express.Router();
const {
  getAllLeads,
  getALead,
  createALead,
  updateALead,
  deleteALead,
  markALead,
} = require("../services/lead");

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
