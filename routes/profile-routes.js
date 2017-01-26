const Controller = require('../controllers/profile-controller');

module.exports = [{
    method: 'POST',
    path: '/data/profile',
    config: {
      handler: function (req, reply) {
        var uid = req.auth.credentials.id;
        var data = req.payload;
        console.log(data);
        return Controller.insert(uid, data, reply);
      }
    }
  },
  {
    method: 'PUT',
    path: '/data/profile/{id}',
    config: {
      handler: function (req, reply) {
        var uid = req.auth.credentials.id;
        var data = req.payload;
        return Controller.update(uid, data, reply);
      }
    }
  },
  {
    method: 'GET',
    path: '/data/profile',
    config: {
      handler: function (req, reply) {
        var uid = req.auth.credentials.id;
        return Controller.find(uid, reply);
      }
    }
  }]
