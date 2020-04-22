const Lead = require("../models/leads");
//  0. get all Leads
const getAllLeads = async (req, res, next) => {
  try {
    const response = await Lead.findAll();
    console.log(response);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

// 1. Fetch a lead
// validate lead_id should be a number
const getALead = async (req, res) => {
  try {
    const id = Number(req.params.lead_id);
    const response = await Lead.findAll({
      where: {
        id: id,
      },
    });
    if (!response.length) return res.status(404).json({});
    const { dataValues } = response[0];
    const requiredResponse = {
      first_name: dataValues.first_name,
      last_name: dataValues.last_name,
      mobile: dataValues.mobile,
      email: dataValues.email,
      location_type: dataValues.location_type,
      location_string: dataValues.location_string,
      status: dataValues.status,
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
const createALead = async (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      mobile,
      email,
      location_type,
      location_string,
    } = req.body;

    const newLead = {
      first_name,
      last_name,
      mobile,
      email,
      location_type,
      location_string,
      status: "Created",
    };
    await Lead.sync();
    const { dataValues } = await Lead.create(newLead);
    return res.status(201).json({
      id: dataValues.id,
      first_name: dataValues.first_name,
      last_name: dataValues.last_name,
      mobile: dataValues.mobile,
      email: dataValues.email,
      location_type: dataValues.location_type,
      location_string: dataValues.location_string,
      status: dataValues.status,
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
    const id = req.params.lead_id;
    const {
      first_name,
      last_name,
      mobile,
      email,
      location_type,
      location_string,
    } = req.body;

    const updatedLead = {
      first_name,
      last_name,
      mobile,
      email,
      location_type,
      location_string,
    };

    await Lead.update(updatedLead, { where: { id } });
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
    const id = req.params.lead_id;
    await Lead.destroy({ where: { id } });
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
    const id = req.params.lead_id;
    const { communication } = req.body;
    const updatedLead = {
      communication,
      status: "Contacted",
    };
    const done = await Lead.update(updatedLead, { where: { id } });
    if (done[0] == 1) {
      const response = await Lead.findAll({
        where: {
          id: id,
        },
      });
      if (!response.length) return res.status(404).json({});
      const { dataValues } = response[0];
      console.log(dataValues);
      const requiredResponse = {
        status: dataValues.status,
        communication: dataValues.communication,
      };
      return res.status(202).json(requiredResponse);
    }
  } catch (err) {
    res.status(400).json({
      status: "failure",
      reason: err.message,
    });
  }
};

module.exports = {
  getAllLeads,
  getALead,
  createALead,
  updateALead,
  deleteALead,
  markALead,
};
