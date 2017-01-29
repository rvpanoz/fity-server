var Mongoose = require('mongoose');

var Metric = new Mongoose.Schema({
  duration: {
    type: Number,
    required: [false, '']
  },
  distance: {
    type: Number,
    required: [false, '']
  },
  date: {
    type: Date,
    required: [false, '']
  },
  metric_type: {
    type: Mongoose.Schema.ObjectId,
    ref: 'Type',
    required: [false, 'Field metric_type is required']
  },
  sets: {
    type: Array,
    required: [false, '']
  },
  notes: {
    type: String,
    required: [false, '']
  },
  activity_id: {
    type: Mongoose.Schema.ObjectId,
    ref: 'Activity'
  }
});

var ActivitySchema = new Mongoose.Schema({
  name: {
    type: String,
    required: [false, 'Field name is required']
  },
  category_id: {
    type: Mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [false, 'Field category_id is required']
  },
  activity_type: {
    type: Mongoose.Schema.ObjectId,
    ref: 'Type',
    required: [false, 'Field activity_type is required']
  },
  metrics: [Metric],
  user_id: {
    type: Mongoose.Schema.ObjectId,
    ref: 'User',
    required: [false, 'Field user_id is required']
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
