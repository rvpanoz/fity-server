const config = require('../config');
const _ = require('lodash');
const utils = require('../util');
const async = require('async');
const moment = require('moment');
const Profile = require('../models/profile');

var ProfileController = _.extend({
  insert: function(uid, data, reply) {
    var profile = new Profile(_.extend(data, {
      user_id: uid
    }));

    //fix date for mongodb
    // var dateString = data.entry_date;
    // var parts = dateString.split('/');
    // var day = parts[0];
    // var month = parts[1];
    // var year = parts[2];
    //
    // var fd = moment(utils.stringToDate(dateString, "dd/MM/yyyy", "/"));

    // if (fd.isValid()) {
    //   data.entry_date = fd.toISOString();
    // } else {
    //   throw Boom.badRequest('Record: Invalid entry date');
    // }

    profile.save(function(err, record) {
      if (err) {
        reply({
          success: false,
          data: [],
          error: err
        });
      } else if (record) {
        reply({
          success: true,
          data: record
        });
      } else {
        throw Boom.badRequest(err);
      }
    });
  },
  update: function(uid, data, reply) {
    Profile.findOne({
      user_id: uid
    }).exec(function(err, profile) {
      if(err) {
        throw new Error(err);
      }
      profile.weight = data.weight;
      profile.setsReps = data.setsReps;
      profile.setsWeight = data.setsWeight;
      profile.updated_at = new Date();
      profile.save(function(err, updated_profile) {
        if(err) {
          throw new Error(err);
        }
        reply({
          success: true,
          data: profile
        });
      })
    })
  },
  find: function(uid, reply) {
    Profile.findOne({
      user_id: uid
    }).exec(function(err, profile) {
      reply({
        success: true,
        data: profile
      });
    })
  }
});

module.exports = ProfileController
