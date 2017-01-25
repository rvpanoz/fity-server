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
