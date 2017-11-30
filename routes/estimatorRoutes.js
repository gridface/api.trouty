var express = require('express'),
router = express.Router();
var mongoose = require("mongoose");
var mongoCollections = require('../models/collections');
var estimatorSchema = require('../models/estimatorSchema');
var estimator = require('../automation/estimator');

//mongodb collection
var estimatorCollection = mongoCollections.AUTOMATION_ESTIMATOR_COLLECTION;
//mongo schema
estimatorSchema = estimatorSchema
//mongoose model  
var estimatorModel = mongoose.model(estimatorCollection, estimatorSchema);

//*********************/
  //test_message api
//*********************/

router.get("/conversations",(req, res) => {
    mongoose.connection.db.collection(estimatorCollection, (err, collection) => {
      collection.find({}).toArray((err, data) =>{
        res.status(200).json(data);
      });
    }); 
  });

  router.get("/test",(req, res) => {
    estimator.getEstimate()
    .then(value => {
      console.log("front end amount returned is " + value)
      res.status(200).send("Your estimated amount is " + value);
      })
    .catch(err => {
      res.status(400).send("automation request failed or timed out");
    }) 
  });


  router.post("/",(req, res) => {
    var myData = new estimatorModel(req.body);

      //process the estimator function with json object
      estimator.getEstimateJson(myData)
      .then(value => {
        console.log("front end amount returned is " + value)
        res.status(200).send("Your estimated amount is " + value);
        })
      .catch(err => {
        res.status(400).send("automation request failed or timed out");
      }) 

          //save the request to the database
    myData.save()
    .then(item => {
      console.log("message saved to database " + myData);
    })
    .catch(err => {
      console.log("unable to save to database");
    });

  }); 

  module.exports = router;