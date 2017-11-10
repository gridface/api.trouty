var express = require('express'),
router = express.Router();
var mongoose = require("mongoose");
var mongoCollections = require('../models/collections')
var messageSchema = require('../models/messageSchema')

//mongodb collection
var messageCollection = mongoCollections.TEST_MESSAGES_COLLECTION;
//mongo schema
messageSchema = messageSchema
//mongoose model  
var messageModel = mongoose.model(messageCollection, messageSchema);

//*********************/
  //test_message api
//*********************/

router.get("/",(req, res) => {
    mongoose.connection.db.collection(messageCollection, (err, collection) => {
      collection.find({}).toArray((err, data) =>{
        res.status(200).json(data);
      });
    }); 
  });



  router.post("/",(req, res) => {
    var myData = new messageModel(req.body);
    myData.save()
      .then(item => {
        res.send("message saved to database " + myData);
      })
      .catch(err => {
        res.status(400).send("unable to save to database");
      });
  }); 

  module.exports = router;