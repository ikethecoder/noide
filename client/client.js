var Nes = require('nes/client')
var host = window.location.host
var config = require('../config/client')
var client = new Nes.Client(config.socket.protocol + '://' + host + '/ide/')

module.exports = client
