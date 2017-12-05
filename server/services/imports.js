
var fs = require('fs');
var p = require('path');
var mkdirp = require('mkdirp')

console.log("IMPORTED");

class Resource {
    constructor (resource) {

        this.resType = Object.keys(resource)[0];
        this.resId = Object.keys(resource[this.resType])[0];
        this.resource = resource[this.resType][this.resId];
    }
}

exports.WRITE = function (outputFile, content, callback) {
    mkdirp(p.resolve(outputFile, '..'), function (err) {
        if (err) console.error(err)
        else console.log('dir created')
    });
    console.log(content);
    fs.writeFile(outputFile, content, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log('The file has been saved! ' + outputFile);
        callback();
    });
}

exports.READ = function (f, callback) {
    fs.readFile(f, function (err, res) {
        if (err) {
            raise ("Error reading file - " + f);
        }
        callback (res);
    });
}

exports.RESOURCES = function (r) {
    return JSON.parse(r)['resources'].map ((res) => new Resource(res)).entries();
}

exports.RESOURCE = function (r) {
    return new Resource(JSON.parse(r));
}