const contactformModel = require("../models/contactUsModel");
const validator = require("../validation/validation");
const moment = require("moment");
require("moment-timezone");
require("dotenv").config();



const contactform = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    let data = req.body;
    // let {name,email,subject,message,phone}= data

    moment.tz.setDefault("Asia/Kolkata"); //default india time zone

    // Get the current date and time
    let date = moment().format("DD/MM/YYYY");
    let time = moment().format("HH:mm:ss");
    data.date = date;
    data.time = time;

    let saveData = await contactformModel.create(data);
    res.status(201).send({ status: true, data: saveData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//=================================================================

const getcontactform = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    let filter = { isDeleted: false }; //required the docs which r not deleted
    //finding the docs with filter and sorting in deceasing order for createdAt key
    let data = await contactformModel.find(filter).sort({ createdAt: -1 });
    return res.status(200).send({
      status: true,
      data: data,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//============================================================
const deleteContactForm = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const contactUsId = req.params.contactUsId; //required contactUsId form path params

    // Validate the userID format (should be a valid MongoDB ObjectId)
    if (!validator.isValidObjectId(contactUsId)) {
      res.status(400).send({
        status: false,
        message: "Please provide valid costumer Id",
      });
    }
    let getID = await contactformModel.findById(contactUsId);
    if (!getID) {
      return res.status(404).send({
        status: false,
        message: "contactUs Id Not Found for the request id",
      });
    }
    if (getID.isDeleted == true) {
      return res.status(404).send({
        status: false,
        message: "contactUs id is already deleted not found",
      });
    }

    await contactformModel.updateOne(
      { _id: contactUsId },
      { isDeleted: true, deletedAt: Date.now() }
    );
    return res.status(200).send({
      status: true,
      message: "contactUs Id is deleted succesfully",
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//================================================================================================
const countOfContactForm = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    //"Retailer", "Manufacturer"
    let data = await contactformModel
      .find({ isDeleted: false })
      .countDocuments();
    res.status(200).send({ status: true, data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//=================================================================================================
const updateContactUs = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    let data = req.body;
    const Id = req.params.contactUsId; //getting the client id from the path params

    let getContactUs = await contactformModel.findById(Id);
    if (!getContactUs) {
      return res.status(404).send({
        status: false,
        message: "no contactUs id found",
      });
    }

    let userData = await contactformModel.findOneAndUpdate({ _id: Id }, data, {
      new: true,
    });
    if (!userData) {
      return res.status(404).send({
        status: false,
        message: "no user found to update",
      });
    }
    return res
      .status(200)
      .send({ status: true, message: "success", data: userData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
//===============================================
module.exports = {
  contactform,
  getcontactform,
  deleteContactForm,
  countOfContactForm,
  updateContactUs,
};
