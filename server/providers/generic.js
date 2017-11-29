exports = module.exports = function (options) {

    options = options || {};

    const uri = options.uri || 'https://es0390.canzea.cc/gw';
    const user = uri + '/me';

    return {
        name: "generic",
        protocol: 'oauth2',
        useParamsAuth: true,
        auth: uri + '/authorize',
        token: uri + '/oauth/token',
        scope: ['basic'],
        scopeSeparator: ' ',
        profile: function (credentials, params, get, callback) {
            get(user, null, (profile) => {

                credentials.profile = profile;

                return callback();
            });
        }
    };
};