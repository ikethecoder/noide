var Nes = require('nes/client')
var host = window.location.host
var client = new Nes.Client('wss://' + host)

module.exports = client
