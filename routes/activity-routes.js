const Controller = require('../controllers/activity-controller');

module.exports = [{
    method: 'GET',
    path: '/data/activities',
    config: {
      handler: function (req, reply) {
        var params = req.params;
        var uid = req.auth.credentials.id;
        return Controller.browse(uid, reply);
      }
    }
  },
  {
    method: 'POST',
    path: '/data/activity',
    config: {
      handler: function (req, reply) {
        var payload = req.payload;
        var uid = req.auth.credentials.id;
        return Controller.insert(uid, payload, reply);
      }
    }
  },
  {
    method: 'PUT',
    path: '/data/activity/{id?}',
    config: {
      handler: function (req, reply) {
        var payload = req.payload;
        var id = req.params.id;
        var uid = req.auth.credentials.id;
        return Controller.update(uid, id, payload, reply);
      }
    }
  },
  {
    method: 'DELETE',
    path: '/data/activities/{id}',
    config: {
      handler: function (req, reply) {
        var cid = req.params.id;
        var uid = req.auth.credentials.id;
        return Controller.remove(uid, cid, reply);
      }
    }
  },
  {
    method: 'GET',
    path: '/data/activity/{id}',
    config: {
      handler: function (req, reply) {
        var cid = req.params.id;
        var uid = req.auth.credentials.id;
        return Controller.get(uid, cid, reply);
      }
    }
  }
];
