const config = require('../config');
const _ = require('lodash');
const utils = require('../util');
const Boom = require('boom');
const async = require('async');
const moment = require('moment');
const Activity = require('../models/activity');
const wlog = require('winston');
wlog.level = 'debug';

var activityController = _.extend({

  browse: function(uid, reply) {
    var populateQuery = [{
        path: 'activity_type'
      },
      {
        path: 'category_id'
      }
    ];
    Activity.find({
      user_id: uid
    }).populate(populateQuery).lean().exec(function(err, activities) {
      if (err) {
        throw Boom.badRequest(err);
      }
      reply({
        success: true,
        data: activities
      });
    });
  },

  insert: function(data, reply) {
    var activity = new Activity(data);
    activity.save(function(err, new_activity) {
      if (err) {
        reply(Boom.badRequest(err));
      } else if (new_activity) {
        reply({
          success: true,
          data: new_activity
        });
      } else {
        reply(Boom.badRequest(err));
      }
    });
  },

  update: function(id, data, reply) {
    Activity.findOne({
      user_id: data.user_id,
      _id: id
    }, function(err, activity) {
      if (err) {
        throw Boom.badRequest(err);
      }

      activity.name = data.name;
      activity.activity_type = data.activity_type;
      activity.updated_at = moment().toISOString();

      if (data.category_id) {
        activity.category_id = data.category_id;
      }

      if (data.metrics && !_.isArray(data.metrics)) {
        var fd = moment(utils.stringToDate(data.metrics['date'], "dd/MM/yyyy", "/"));
        if (fd.isValid()) {
          data.metrics['date'] = fd.toISOString();
        } else {
          throw Boom.badRequest('Metrics: Invalid date');
        }
        var reps = data.metrics['reps'];
        var weight = data.metrics['weight'];
        if (reps && weight) {
          data.metrics['sets'] = [{
            reps: reps,
            weight: weight
          }];
        }
        data.metrics['activity_id'] = activity.id;
        activity.metrics.push(data.metrics);
      }

      activity.save(function(err, updated_activity) {
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

  get: function(uid, id, reply) {
    var populateQuery = [{
        path: 'activity_type'
      },
      {
        path: 'category_id'
      }
    ];
    Activity.findOne({
      user_id: uid,
      _id: id
    }).populate(populateQuery).exec(function(err, activity) {
      if (err) {
        throw Boom.badRequest(err);
      }
      reply({
        success: true,
        data: activity
      });
    });
  },

  remove: function(uid, id, reply) {
    Activity.findOne({
      user_id: uid,
      _id: id
    }, function(err, activity) {
      if (err) {
        throw Boom.badRequest(err);
      }

      activity.remove(function(err, removed_activity) {
        if (err) {
          throw Boom.badImplementation('activity:  Error on deleting activity', err);
        }
        reply({
          success: true,
          data: removed_activity
        })
      });
    });
  },

  removeMetric: function(uid, aid, mid, reply) {
    Activity.findByIdAndUpdate(aid, {
      $pull: {
        metrics: {
          _id: mid
        }
      }
    }, function(err, metric) {
      reply({
        success: true,
        data: [metric]
      })
    });
  }

});

module.exports = activityController;
