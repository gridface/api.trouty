var express = require('express');
var router = express.Router();
var mongodb = require("mongodb");
var mongoose = require("mongoose");
var ObjectId = require('mongodb').ObjectID;
//var ObjectID = mongodb.ObjectID;
var dbConfig = require('../bin/database.js');
//var regulationsApi = require('./routes/regulations');
var messagesApi = require('./messageRoutes');
var regulationsApi = require('./regulationRoutes');
var estimatorAutomation = require('./estimatorRoutes');


var uristring =
process.env.MONGOLAB_URI || "mongodb://tester:testpass@ds133331.mlab.com:33331/heroku_jzczm24z";

/**
 * 11/9 12:00pm: by commenting out this native connection via mongodb, i will likely break all of my post operations
 */


// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;
// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || dbConfig.url, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");
});

/**
 * 
 */


//connect with mongoose instead
mongoose.connect(uristring, function (err, res){
    if (err) {
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
    console.log ('Succeeded connected to: ' + uristring);
    }
})

// Home page
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

// Messages API
router.use('/api/messages', messagesApi);

// Regulations API
router.use('/api/regulations', regulationsApi);

// DhpEstimator Automation
router.use('/automation/estimator', estimatorAutomation);


/**
 *    These are still here till i figure out how to post with mongo
 *    AND they support the angular app
 *   
 *    "/api/regulations/:id"
 *    GET: find regulation by id
 *    PUT: update regulation by id
 *    DELETE: deletes regulation by id
 */

router.post("/regulations", function(req, res) {
  var newRegulation = req.body;
//   newRegulation.createDate = new Date();

  // if (!(req.body.landmark)) {
  //   handleError(res, "Invalid user input", "Must provide a landmark.", 400);
  // }

  db.collection(REGULATIONS_COLLECTION).insertOne(newRegulation, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new regulation.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

  
    router.put("/regulations/:id", function(req, res) {
    var updateDoc = req.body;
    delete updateDoc._id;
  
    db.collection(REGULATIONS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to update regulation");
      } else {
        res.status(204).end();
      }
    });
  });
  
  router.delete("/regulations/:id", function(req, res) {
    db.collection(REGULATIONS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
      if (err) {
        handleError(res, err.message, "Failed to delete regulation");
      } else {
        res.status(204).end();
      }
    });
  });
  // error handlers




module.exports = router;



