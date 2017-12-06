const config = require('../../config')
const fs = require('fs');
var chokidar = require('chokidar')
var p = require('path')
var fsw = require('./file-system-watcher')
var helper = require('./imports')
var FileSystemObject = require('../file-system-object')
var Rx = require('rxjs/Rx');
const {NodeVM} = require('vm2');

var watcher = fsw.watcher

var fileCatalog = {};

var broadcast = new Rx.Subject();

const vm = new NodeVM({
    console: 'inherit',
    sandbox: {
        "READ": helper.READ,
        "WRITE": helper.WRITE,
        "RESOURCE": helper.RESOURCE,
        "RESOURCES": helper.RESOURCES,
        "files": fileCatalog,
        "broadcast": broadcast,
        "baseDir": folder = p.resolve(config.server.folder)
    },
    require: {
        external: true,
        import: ['rxjs', 'mkdirp', 'handlebars'],
        builtin: ['fs', 'path', 'helper'],
        root: "./"
    }
});

root = p.resolve(config.server.folder)

function recurse (folder) {
    fs.readdir(folder, (err, files) => {
      files.forEach(file => {

        fullFile = p.join(folder, file);

        if (fs.lstatSync(fullFile).isDirectory()) {
            recurse(fullFile);
        } else {
            if (isRule(fullFile)) {
                registerRule(fullFile, (e) => {
                    console.log("Watching: " + p.relative(root, fullFile));
                });
            } else {
                console.log("Watching: " + p.relative(root, fullFile));
                fileCatalog[p.relative(root, fullFile)] = 'init';
            }
        }
      });
    })
}

recurse(root);

function isRule (file) {
    return (file.endsWith('.rule') || file.endsWith('.rule.js'))
}

function registerRule (file, callback) {
    if (isRule(file)) {
        fs.readFile(file, 'utf8', function (err,code) {
          if (err) {
            return console.log(err);
          }
          try {
            var ff = p.relative(root, file)
            if (fileCatalog.hasOwnProperty(ff)) {
                try {
                    fileCatalog[ff].unsubscribe();
                } catch (e) {
                    console.log("WARN: Eval error " + e);
                }
            }
            var func = vm.run (code, 'imports.js');
            console.log("Subscribing to = "+ff);
            fileCatalog[ff] = func;
            fileCatalog[ff].start();
            callback();
          } catch (e) {
            console.log("WARN: Eval error " + e);
          }
        });
    }
}

function triggerAll() {
    Object.keys(fileCatalog).forEach((f) => {
        console.log("Notify: " + f);
        broadcast.next(p.relative(folder, f));
    });
}

module.exports = function (server) {

  watcher.on('all', function (event, path, stat) {
    stat = stat || (event === 'unlinkDir')
    var fso = new FileSystemObject(path, stat)
    server.log('info', `abstract-rules event happened ${event} ${fso.path}`)

    if (isRule(fso.path)) {
        registerRule (fso.path, triggerAll);
    } else {
        fileCatalog[p.relative(root, fso.path)] = 'updated';
        broadcast.next(p.relative(root, fso.path));
    }
  });
}
