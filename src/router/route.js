const express = require("express")
let router = express.Router()
let {careers,getCareers , updateCareers, individualEntry} =require("../controller/careerContoller")
const {
    contactform,
    getcontactform,
    deleteContactForm,
    updateContactUs,
  } = require("../controller/contactUsController");

//====================================================================
router.get("/test-me", function (req, res) {
    res.send("this is successfully created");
  });
//======================================================================
router.post("/careers",careers)
router.get("/getCareers",getCareers)
router.get("/individualEntry/:Id",individualEntry)
//=============================================================
router.put("/updateCareers/:Id",updateCareers)

//======================contactform================================
router.post("/contactform", contactform);
router.get("/getcontactform", getcontactform); //by admin
router.delete(
  "/deleteContactForm/:contactUsId/:userID",
//   authentication,
//   authorization3,
  deleteContactForm
); // by admin
router.put(
  "/updateContactUs/:contactUsId/:userID",
//   authentication,
//   authorization3,
  updateContactUs
);



module.exports = router