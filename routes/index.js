var express = require('express');
var router = express.Router();
var mongodb = require("mongodb");
var mongoose = require("mongoose");
var ObjectID = mongodb.ObjectID;


var uristring =
//process.env.MONGOLAB_URI ||
"mongodb://tester:testpass@ds133331.mlab.com:33331/heroku_jzczm24z";

//name of mongo database collection to use
var REGULATIONS_COLLECTION = "regulation";

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.

//this line is used after setting the MONGODB_URI env variable in heroku
//mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {

mongodb.MongoClient.connect("mongodb://tester:testpass@ds133331.mlab.com:33331/heroku_jzczm24z", function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");
});


//connect with mongoose instead
mongoose.connect(uristring, function (err, res){
    if (err) {
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
    } else {
    console.log ('Succeeded connected to: ' + uristring);
    }
})

var fishingRegulationSchema = new mongoose.Schema({
  
    landmark: String,
    coord: String,
    county: String,
    state: {type: String, default: 'WI' },
    zipcode: String,
    landmark_type: String,
    regulation_type: String,
    bag_limit: String,
    min_size: String,
    release_only: Boolean,
    other_restrictions: {type: String, trim: true },
    open_season_start: String,
    open_season_end: String,
    regulation_year: String
  
});

var FishingReg = mongoose.model(REGULATIONS_COLLECTION, fishingRegulationSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/*  "/api/regulations"
 *    GET: finds all regulations
 *    POST: creates a new contact
 */
// router.get("/api/regulations", function(req, res) {
//     db.collection(REGULATIONS_COLLECTION).find({}).toArray(function(err, docs) {
//       if (err) {
//         handleError(res, err.message, "Failed to get regulations.");
//       } else {
//         res.status(200).json(docs);
//       }
//     });
//   });

  router.get("/api/regulations", function(req, res) {
    mongoose.connection.db.collection(REGULATIONS_COLLECTION, function (err, collection) {
      collection.find({}).toArray(function(err, data){
        res.status(200).json(data);
      });
    }); 
  });

  router.get("/api/regulations/:landmark", function(req, res) {
    mongoose.connection.db.collection(REGULATIONS_COLLECTION, function (err, collection) {
      lm = req.params.landmark;
      console.log("parameter passed is " + lm);
      console.log(collection.collectionName)
      collection.find({"landmark" : new RegExp(lm, "i")}).toArray(function(err, data){
        res.status(200).json(data);
      });
    }); 
  });

  // router.get("/api/regulations/search", function(req, res) {
  //   mongoose.connection.db.collection(REGULATIONS_COLLECTION, function (err, collection) {
  //     collection.find({"landmark_type" : ).toArray(function(err, data){
  //       res.status(200).json(data);
  //     });
  //   }); 
  // });

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


/*  "/api/regulations/:id"
 *    GET: find regulation by id
 *    PUT: update regulation by id
 *    DELETE: deletes regulation by id
 */
router.get("/regulations/:_id", function(req, res) {
    db.collection(REGULATIONS_COLLECTION).findOne({ _id: new ObjectID(req.params._id) }, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to get regulation");
      } else {
        res.status(200).json(doc);
        console.log("requested " + req.params._id);
      }
    });
  });
  
  router.get("/regulations/:landmark_type", function(req, res, next) {
     // db.collection(REGULATIONS_COLLECTION).findOne({ landmark_type: new ObjectID(req.params.landmark_type) }, function(err, doc) {
      db.collection(REGULATIONS_COLLECTION).find({landmark_type: new ObjectID(req.params.landmark_type)}).toArray(function(err, docs) {
        if (err) {
          handleError(res, err.message, "Failed to get regulations.");
        } else {
          res.status(200).json(docs);
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



