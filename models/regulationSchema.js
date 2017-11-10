var mongoose = require('mongoose');


var regulationSchema = new mongoose.Schema({
    
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
  
module.exports = regulationSchema