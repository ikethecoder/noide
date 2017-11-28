var bell = require('bell');
const Provider = require('./providers/generic');

module.exports.register = function (server, options, next) {

    server.register(bell, function (err) {

                                // Declare an authentication strategy using the bell scheme
                                // with the name of the provider, cookie encryption password,
                                // and the OAuth client credentials.
                                server.auth.strategy('generic', 'bell', {
                                    provider: Provider.call(null, {}),
                                    password: 'cookie_encryption_password_secure',
                                    clientId: '2222-0000-0000-0000',
                                    clientSecret: '2222-0000-0000-0001',
                                    isSecure: true     // Terrible idea but required if not using HTTPS especially if developing locally
                                });
    });
    console.log("REGISTERED");
    return next();
};

module.exports.register.attributes = {
    "name": "twit"
};
