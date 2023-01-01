const vaccineModel = require("../models/vaccineModel");
const UserModel = require("../models/userModel");
const userModel = require("../models/userModel");

const createVaccine = async function (req, res) {
  try {
    let data = req.body;
    let createVaccinedData = await vaccineModel.create(data);
    return res.status(201).send({ status: true, data: createVaccinedData });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const getUserData = async function (req, res) {
  try {
    let QueryValue = {};
    let { VaccinationStatus, Age, Pincode } = req.query;
    if (Pincode) {
      QueryValue["Pincode"] = Pincode;
    }
    if (Age) {
      QueryValue["Age"] = Age;
    }
    if (VaccinationStatus) {
      QueryValue["VaccinationStatus"] = VaccinationStatus;
    }
    console.log(QueryValue);
    const getUserData = await userModel.find(QueryValue);
    return res.status(200).send({ status: true, data: getUserData });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const vaccineDetails = async function (req, res) {
  try {
    let data = await vaccineModel.findOne().select({ availableSlots: 1,_id:0 });
    return res.status(200).send({ status: true, data: data });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = { createVaccine, getUserData,vaccineDetails };