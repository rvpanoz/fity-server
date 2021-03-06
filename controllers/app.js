/*
 * App controller
 */

'use strict';

//imports
const bcrypt = require('bcryptjs');
const Boom = require('boom');
const wlog = require('winston');
const _ = require('lodash');
const async = require('async');
const moment = require('moment');
const config = require('../config');
const createToken = require('../token');
const utils = require('../util');
const User = require('../models/user');
const ActivityType = require('../models/type');
const winston = require('winston');

winston.level = 'debug';
var logger = new(winston.Logger)({
  transports: [new(winston.transports.Console)(), new(winston.transports.File)({
    filename: 'appLog.log',
    timestamp: true
  })]
});

function hashPassword(password, cb) {
  // Generate a salt at level 10 strength
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      return cb(err, hash);
    });
  });
}

var app = _.extend({}, {
  user_id: null,
  users: {
    authenticate: function(req, reply) {
      // If the user's password is correct, we can issue a token.
      // If it was incorrect, the error will bubble up from the pre method
      reply({
        success: true,
        data: {
          admin: req.pre.user.admin,
          email: req.pre.user.email,
          id_token: createToken(req.pre.user)
        }
      });
    },
    insert: function(reply, attrs) {
      var user = new User(attrs);

      hashPassword(attrs.password, (err, hash) => {
        if (err) {
          throw Boom.badRequest(err);
        }
        user.password = hash;
        user.save((err, new_user) => {
          if (err) {
            throw Boom.badRequest(err);
          }
          // If the user is saved successfully, issue a JWT
          reply({
            success: true,
            data: {
              id_token: createToken(new_user)
            }
          });
        });
      });
    }
  },
  getTypes(reply) {
    ActivityType.find({}, function(err, types) {
      if(err) {
        throw new Error(err);
      }
      return reply({
        success: true,
        data: types
      });
    });
  },
  log(level, msg) {
    if(level) {
      switch (level) {
        case 'error':
          logger.error(level, msg);
          break;
        default:
          logger.info(level, msg);
      }
    }
  }
});

module.exports = app
