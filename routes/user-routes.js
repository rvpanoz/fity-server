const Controller = require('../controllers/app');
const verifyCredentials = require('../util').verifyCredentials;
const verifyUniqueUser = require('../util').verifyUniqueUser;
console.log(Controller.users);

module.exports = [{
    method: 'POST',
    path: '/user',
    config: {
      auth: false,
      // Before the route handler runs, verify that the user is unique
      pre: [{
        method: verifyUniqueUser
      }],
      handler: (req, reply) => {
        var payload = req.payload;
        return Controller.users.insert(reply, payload);
      }
    }
  },
  {
    method: 'POST',
    path: '/user/authenticate',
    config: {
      auth: false,
      // Check the user's password against the DB
      pre: [{
        method: verifyCredentials,
        assign: 'user'
      }],
      handler: (req, reply) => {
        return Controller.users.authenticate(req, reply);
      }
    }
  }
]
