var express = require('express'),
router = express.Router();
var mongoose = require("mongoose");
var mongoCollections = require('../models/collections')
var regSchema = require('../models/regulationSchema')

//mongodb collection
//var REGULATIONS_COLLECTION = "regulation";
REGULATIONS_COLLECTION = mongoCollections.REGULATIONS_COLLECTION;


//mongoose schema
// var fishingRegulationSchema = new mongoose.Schema({
    
//       landmark: String,
//       coord: String,
//       county: String,
//       state: {type: String, default: 'WI' },
//       zipcode: String,
//       landmark_type: String,
//       regulation_type: String,
//       bag_limit: String,
//       min_size: String,
//       release_only: Boolean,
//       other_restrictions: {type: String, trim: true },
//       open_season_start: String,
//       open_season_end: String,
//       regulation_year: String
    
//   });
  var fishingRegulationSchema = regSchema
  
  var FishingReg = mongoose.model(REGULATIONS_COLLECTION, fishingRegulationSchema);
  

  router.get("/", function(req, res) {
    mongoose.connection.db.collection(REGULATIONS_COLLECTION, function (err, collection) {
      collection.find({}).toArray(function(err, data){
        res.status(200).json(data);
      });
    }); 
  });

  router.get("/getbylandmark/:landmark", function(req, res) {
    mongoose.connection.db.collection(REGULATIONS_COLLECTION, function (err, collection) {
      lm = req.params.landmark;
      console.log("parameter passed is " + lm);
      collection.find({"landmark" : new RegExp(lm, "i")}).toArray(function(err, data){
        res.status(200).json(data);
      });
    }); 
  });

  router.get("/getbylandmarktype/:landmark_type", function(req, res) {
    mongoose.connection.db.collection(REGULATIONS_COLLECTION, function (err, collection) {
      lmt = req.params.landmark_type;
      console.log("parameter passed is " + lmt);
      collection.find({"landmark_type" : new RegExp(lmt, "i")}).toArray(function(err, data){
        res.status(200).json(data);
      });
    }); 
  });

  router.get("/getbyid/:uId", function(req, res) {
    mongoose.connection.db.collection(REGULATIONS_COLLECTION, function (err, collection) {
      uId = ObjectId(req.params.uId);
      console.log("ID parameter passed is " + uId);
      //console.log("parameter passed is $$$$$$ " + collection.collectionName);
      collection.find({"_id" : uId}).toArray(function(err, data){
        res.status(200).json(data);
      });
    }); 
  });





module.exports = router;