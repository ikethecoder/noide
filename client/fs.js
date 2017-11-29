var client = require('./client')

const prefix = '/ide'

function readFile (path, callback) {
  client.request({
    path: prefix + '/readfile?path=' + path,
    method: 'GET'
  }, callback)
}

function writeFile (path, contents, callback) {
  client.request({
    path: prefix + '/writefile',
    payload: {
      path: path,
      contents: contents
    },
    method: 'PUT'
  }, callback)
}

function mkdir (path, callback) {
  client.request({
    path: prefix + '/mkdir',
    payload: {
      path: path
    },
    method: 'POST'
  }, callback)
}

function mkfile (path, callback) {
  client.request({ path: prefix + '/mkfile',
    payload: {
      path: path
    },
    method: 'POST'
  }, callback)
}

function copy (source, destination, callback) {
  client.request({
    path: prefix + '/copy',
    payload: {
      source: source,
      destination: destination
    },
    method: 'POST'
  }, callback)
}

function rename (oldPath, newPath, callback) {
  client.request({
    path: prefix + '/rename',
    payload: {
      oldPath: oldPath,
      newPath: newPath
    },
    method: 'PUT'
  }, callback)
}

function remove (path, callback) {
  client.request({
    path: prefix + '/remove',
    payload: {
      path: path
    },
    method: 'DELETE'
  }, callback)
}

module.exports = {
  mkdir: mkdir,
  mkfile: mkfile,
  copy: copy,
  readFile: readFile,
  writeFile: writeFile,
  rename: rename,
  remove: remove
}
