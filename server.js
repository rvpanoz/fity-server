'use strict';

// imports
const Path = require('path');
const Hapi = require('hapi');
const Wreck = require('wreck');
const Mongoose = require('mongoose');
const Boom = require('boom');
const _ = require('lodash');
const secret = require('./secret');
const config = require('./config');

// database connection
Mongoose.connect(config.mongoConString);

// use bluebird Promises Library
Mongoose.Promise = require('bluebird');

// enable debug mode - log queries to the console
Mongoose.set('debug', config.mongoDebug);

// hapi server instance
var server = new Hapi.Server({
  connections: {
    routes: {
      cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-with']
      }
    }
  }
});

// server connection
server.connection({
  port: config.port
});

const app = require('./controllers/app');

server.register(require('hapi-auth-jwt'), (err) => {
  server.auth.strategy('jwt', 'jwt', 'required', {
    key: secret,
    verifyOptions: {
      algorithms: ['HS256']
    }
  });

  //app routes
  server.route(require('./routes/user-routes'));
  server.route(require('./routes/category-routes'));
  server.route(require('./routes/activity-routes'));
  server.route(require('./routes/profile-routes'));

  server.route({
    method: 'GET',
    path: '/data/types',
    config: {
      auth: false,
      handler(req, reply) {
        return app.getTypes(reply);
      }
    }
  })

  //*start the server
  server.start(function (err) {
    if (err) {
      throw new Error(err);
    }
    console.log('Server is running at ' + server.info.host + ":" + server.info.port);
  });

});
