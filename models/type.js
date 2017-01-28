/*
** Types model definition
*/

//imports
var Mongoose = require('mongoose');

//definition
var TypeSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Field name is required']
  },
  created_at: {
    type: Date,
    default: new Date()
  }
});

module.exports = Mongoose.model('Type', TypeSchema);
