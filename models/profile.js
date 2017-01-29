'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user_id: {
    type: Schema.ObjectId,
    ref: 'User',
    required: [true, 'Field user_id is required']
  },
  weight: {
    type: Number
  },
  setsReps: {
    type: Number
  },
  setsWeight: {
    type: Number
  },
  updated_at: {
    type: Date,
    default: new Date()
  },
  created_at: {
    type: Date,
    default: new Date()
  }
});

module.exports = mongoose.model('Profile', ProfileSchema);
