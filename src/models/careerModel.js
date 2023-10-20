const mongoose = require('mongoose');


const careersSchema = new mongoose.Schema({
  salutation: String,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  alterPhone: String,
  lastCompany: String,
  jobTitle: String,
  jobLocation: String,
  totalExp: String,
  profileSum: String,
  lastDwarnSalary: String,
 // yearsOfExp: String,
  skills: String,
  currentCTC: String,
  expectedCTC: String,
  qualification: String,
  resumeLink: String,
  address:String,
  status: {
    type: String,
    enum: ["Approved", "Rejected", "Pending"],
    default: "Pending"
  },
  date: {
    type: String
  },
  time: {
    type: String
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  }
}, { timestamps: true });




module.exports = mongoose.model('Saboo Groups Careers', careersSchema);

