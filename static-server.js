var paperboy = require('paperboy');
var http = require('http');
var path = require('path');
var exec = require('child_process').exec;

WEBROOT = path.join(path.dirname(__filename), 'site');

http.createServer(function(req, res) {
  paperboy
    .deliver(WEBROOT, req, res)
    .otherwise(function(err) {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end("Error 404: File not found");
    });
}).listen(8000);

exec('node build.js demo');
