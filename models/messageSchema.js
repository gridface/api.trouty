var mongoose = require('mongoose');
  
var messageSchema = new mongoose.Schema({ 
    email: String,
    from: String,
    to: String,
    time: String,
    source: String,
    body: String
});
  
module.exports = messageSchema