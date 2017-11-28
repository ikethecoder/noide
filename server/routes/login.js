var Boom = require('boom')
var fileutils = require('../file-system-utils')

module.exports = {
 method: ['GET', 'POST'], // Must handle both GET and POST
 path: '/login',          // The callback endpoint registered with the provider
 config: {
     handler: function (request, reply) {

         if (!request.auth.isAuthenticated) {
             return reply('Authentication failed due to: ' + request.auth.error.message);
         }

         // Perform any account lookup or registration, setup local session,
         // and redirect to the application. The third-party credentials are
         // stored in request.auth.credentials. Any query parameters from
         // the initial request are passed back via request.auth.credentials.query.
         return reply.redirect('/');
     }
 }
}
