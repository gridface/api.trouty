var mongoose = require('mongoose');

var estimatorSchema = new mongoose.Schema({ 
  group: String,
  location: String,
  cptCode: String,
  practitioner: String,
  procedureDate: String,
  user: String,
  processDate: String
});

module.exports = estimatorSchema