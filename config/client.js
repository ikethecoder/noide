var path = require('path')
var argv = require('./argv')

var config = {
  ace: {
    tabSize: 2,
    fontSize: 12,
    theme: 'monokai',
    useSoftTabs: true
  },
  socket: {
    protocol: 'ws'
  }
}

if (argv.client) {
  config = require(path.resolve(process.cwd(), argv.client))
}

module.exports = config
