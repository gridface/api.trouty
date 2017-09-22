var express = require('express');
var router = express.Router();

var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var REGULATIONS_COLLECTION = "regulation";
// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
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

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });



/*  "/regulations"
 *    GET: finds all regulations
 *    POST: creates a new contact
 */

router.get("/regulations", function(req, res) {
    db.collection(REGULATIONS_COLLECTION).find({}).toArray(function(err, docs) {
      if (err) {
        handleError(res, err.message, "Failed to get regulations.");
      } else {
        res.status(200).json(docs);
      }
    });
  });

/*  "/regulations/:id"
 *    GET: find regulation by id
 *    PUT: update regulation by id
 *    DELETE: deletes regulation by id
 */
router.get("/regulations/:id", function(req, res) {
    db.collection(REGULATIONS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to get regulation");
      } else {
        res.status(200).json(doc);
      }
    });
  });
  
  router.get("/regulations/landmarkType", function(req, res) {
      db.collection(REGULATIONS_COLLECTION).findOne({ _id: new ObjectID(req.params.landmarkType) }, function(err, doc) {
        if (err) {
          handleError(res, err.message, "Failed to get regulation");
        } else {
          res.status(200).json(doc);
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


