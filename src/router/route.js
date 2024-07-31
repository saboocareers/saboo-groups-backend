const express = require("express");
let router = express.Router();
let {
  careers,
  getCareers,
  updateCareers,
  individualEntry,
} = require("../controller/careerContoller");
const {
  contactform,
  getcontactform,
  deleteContactForm,
  updateContactUs,
  dupesSabooGroupsContactUs,
  SabooGroupsUniqueEntries,
  SabooGroupsRange,
} = require("../controller/contactUsController");


const {getAllDataStaisticsPage} = require("../controller/AllDataStatisticsController")
//====================================================================
router.get("/test-me", function (req, res) {
  res.send("this is successfully created");
});
//======================================================================
router.post("/careers", careers);
router.get("/getCareers", getCareers);
router.get("/individualEntry/:Id", individualEntry);
//=============================================================
router.put("/updateCareers/:Id", updateCareers);

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

router.post("/SabooGroupsRange",SabooGroupsRange),
router.get("/SabooGroupsUniqueEntries", SabooGroupsUniqueEntries)
router.get("/dupesSabooGroupsContactUs",dupesSabooGroupsContactUs)

//==============================================================

router.get("/getAllDataStaisticsPage",getAllDataStaisticsPage)
module.exports = router;
