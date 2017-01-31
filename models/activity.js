var Mongoose = require('mongoose');

var Metric = new Mongoose.Schema({
  duration: {
    type: Number
  },
  distance: {
    type: Number
  },
  date: {
    type: Date,
    required: [true, 'Field date is required']
  },
  metric_type: {
    type: Mongoose.Schema.ObjectId,
    ref: 'Type'
  },
  sets: {
    type: Array
  },
  notes: {
    type: String
  },
  activity_id: {
    type: Mongoose.Schema.ObjectId,
    ref: 'Activity'
  }
});

var ActivitySchema = new Mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Field name is required']
  },
  category_id: {
    type: Mongoose.Schema.ObjectId,
    ref: 'Category'
  },
  activity_type: {
    type: Mongoose.Schema.ObjectId,
    ref: 'Type',
    required: [true, 'Field activity_type is required']
  },
  metrics: [Metric],
  user_id: {
    type: Mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Field user_id is required']
  },
  updated_at: {
    type: Date
  },
  created_at: {
    type: Date,
    default: new Date()
  }
});

module.exports = Mongoose.model('Activity', ActivitySchema);
