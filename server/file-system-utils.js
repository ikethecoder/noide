var fs = require('fs')
var isUtf8 = require('is-utf8')
var p = require('path')
var common = require('./common')
var ncp = require('ncp').ncp
var FileSystemObject = require('./file-system-object')
var rimraf = require('rimraf')

ncp.limit = 6

exports.remove = function (path, callback) {
  fs.stat(path, function (err, stat) {
    if (err) {
      callback(err)
      return
    }

    function cb (err) {
      callback(err, err ? null : new FileSystemObject(path, stat))
    }
    if (stat.isDirectory()) {
      rimraf(path, cb)
    } else {
      fs.unlink(path, cb)
    }
  })
}

exports.rename = function (oldPath, newPath, callback) {
  fs.exists(newPath, function (exists) {
    if (exists) {
      callback(new Error('File already exists'))
      return
    }
    fs.stat(oldPath, function (err, stat) {
      if (err) {
        callback(err)
        return
      }
      fs.rename(oldPath, newPath, function (err) {
        callback(err, err ? null : [new FileSystemObject(oldPath, stat), new FileSystemObject(newPath, stat)])
      })
    })
  })
}

exports.copy = function (source, destination, callback) {
  fs.exists(destination, function (exists) {
    if (exists || (source === destination)) {
      // add random str to destination
      var ext = p.extname(destination)
      destination = p.join(p.dirname(destination), p.basename(destination, ext) + '_' + common.rndstr() + ext)
    }

    fs.stat(source, function (err, stat) {
      if (err) {
        callback(err)
        return
      }
      ncp(source, destination, {
        clobber: false
      }, function (err) {
        callback(err, err ? null : new FileSystemObject(destination, stat))
      })
    })
  })
}

exports.writeFile = function (path, contents, callback) {
  fs.writeFile(path, contents, 'utf8', function (err) {
    if (err) {
      callback(err)
      return
    }

    fs.stat(path, function (err, stat) {
      callback(err, err ? null : new FileSystemObject(path, stat))
    })
  })
}

exports.readFile = function (path, callback) {
  fs.stat(path, function (err, stat) {
    if (err) {
      callback(err)
      return
    }

    var fileSizeInMegabytes = stat.size / 1e6
    var maxAllowedFileRead = 7
    if (fileSizeInMegabytes > maxAllowedFileRead) {
      callback(new Error('File size limit ' + maxAllowedFileRead + 'MB'))
      return
    }

    fs.readFile(path, function (err, buffer) {
      if (err) {
        callback(err)
        return
      }

      var contents = isUtf8(buffer) ? buffer.toString('utf8') : buffer

      callback(null, common.extend(new FileSystemObject(path, stat), {
        contents: contents
      }))
    })
  })
}

exports.mkdir = function (path, callback) {
  fs.mkdir(path, '755', function (err) {
    callback(err, err ? null : new FileSystemObject(path, true))
  })
}
