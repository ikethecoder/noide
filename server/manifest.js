const config = require('../config')

const oauth = __dirname + '/oauth'

var fs = require('fs');

var tls = false;
if (config.server.tls) {
    tls = {
      key: fs.readFileSync('/var/local/consul/ssl/consul.key'),
      cert: fs.readFileSync('/var/local/consul/ssl/consul.cert'),
      ca: fs.readFileSync('/var/local/consul/ssl/ca.cert')
    };
}

const manifest = {
  server: {
  },
  connections: [
    {
      port: config.server.port,
      host: config.server.host,
      labels: config.server.labels,
      tls: tls
    }
  ],

  registrations: [
    {
      plugin: {
        register: 'inert'
      }
    },
    {
      plugin: {
        register: 'vision'
      }
    },
    {
      plugin: {
        register: 'nes'
      }
    },
    {
      plugin: {
        register: oauth,
        options: {
            client_id : config.server.client_id,
            client_secret : config.server.client_secret,
            is_secure : config.server.tls
        }
      }
    },
    {
      plugin: {
        register: 'good',
        options: config.logging
      }
    }]
}

module.exports = manifest
