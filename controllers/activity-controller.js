const config = require('../config')
const _ = require('lodash')
const utils = require('../util')
const Boom = require('boom')
const async = require('async')
const moment = require('moment')
const Activity = require('../models/activity')

var activityController = _.extend({

  browse: function (uid, reply) {
    Activity.find({
      user_id: uid
    }).populate('activity_type').lean().exec(function (err, activities) {
      if (err) {
        throw Boom.badRequest(err);
      }
      reply({
        success: true,
        data: activities
      });
    });
  },

  insert: function (uid, data, reply) {
    var activity = new Activity(_.extend(data, {
      user_id: uid
    }));

    activity.save(function (err, new_activity) {
      if (err) {
        reply({
          success: false,
          data: [],
          error: err
        });
      } else if (new_activity) {
        reply({
          success: true,
          data: new_activity
        });
      } else {
        throw Boom.badRequest(err);
      }
    });
  },

  update: function (uid, id, data, reply) {
    Activity.findOne({
      user_id: uid,
      _id: id
    }, function (err, activity) {;
      if (err) {
        throw Boom.badRequest(err);
      }

      activity.name = data.name;
      activity.activity_type = data.activity_type._id;
      activity.category_id = data.category_id;
      activity.updated_at = moment().toISOString();

      var fd = moment(utils.stringToDate(data.metrics['date'], "dd/MM/yyyy", "/"));
      if (fd.isValid()) {
        data.metrics['date'] = fd.toISOString();
      } else {
        throw Boom.badRequest('Metrics: Invalid date');
      }
      
      //add metrics
      activity.metrics.push(data.metrics);

      activity.save(function (err, updated_activity) {
        if (err) {
          throw Boom.badImplementation('activity:  Error on updating activity', err);
        }
        reply({
          success: true,
          data: updated_activity
        })
      });
    });
  },

  get: function (uid, id, reply) {
    Activity.findOne({
      user_id: uid,
      _id: id
    }).populate('activity_type').exec(function (err, activity) {
      if (err) {
        throw Boom.badRequest(err);
      }
      reply({
        success: true,
        data: activity
      });
    });
  },

  remove: function (uid, id, reply) {
    Activity.findOne({
      user_id: uid,
      _id: id
    }, function (err, activity) {
      if (err) {
        throw Boom.badRequest(err);
      }

      activity.remove(function (err, removed_activity) {
        if (err) {
          throw Boom.badImplementation('activity:  Error on deleting activity', err);
        }
        reply({
          success: true,
          data: removed_activity
        })
      });
    });
  }

})

module.exports = activityController;