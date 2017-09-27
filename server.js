var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var REGULATIONS_COLLECTION = "regulation";

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());



// //this is set as the start in the package.json file, but to run gridface homepage alone, 
// //change the value in package.json to "start: npm .bin/www"

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

  // Initialize the app.
  var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// regulations API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/regulations"
 *    GET: finds all regulations
 *    POST: creates a new contact
 */

app.get("/regulations", function(req, res) {
  db.collection(REGULATIONS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get regulations.");
    } else {
      res.status(200).json(docs);
    }
  });
});
// curl -v -H "Content-Type:application/json" -X POST http://localhost:3000/regulations -d '{"title":"Quarks & Co - zum Mitnehmen - GREAT PODCAST"}'

//curl -v -H "Content-Type:application/json" -X POST http://localhost:3000/regulations -d '{"landmark":"curl tester 888"}' 

app.post("/regulations", function(req, res) {
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

/*  "/regulations/:id"
 *    GET: find regulation by id
 *    PUT: update regulation by id
 *    DELETE: deletes regulation by id
 */

app.get("/regulations/:id", function(req, res) {
  db.collection(REGULATIONS_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get regulation");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.get("/regulations/landmarkType", function(req, res) {
    db.collection(REGULATIONS_COLLECTION).findOne({ _id: new ObjectID(req.params.landmarkType) }, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to get regulation");
      } else {
        res.status(200).json(doc);
      }
    });
  });

app.put("/regulations/:id", function(req, res) {
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

app.delete("/regulations/:id", function(req, res) {
  db.collection(REGULATIONS_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete regulation");
    } else {
      res.status(204).end();
    }
  });
});