var paperboy = require('paperboy');
var http = require('http');
var path = require('path');
var exec = require('child_process').exec;
var build = require('./src/build');
var tooling = require('./src/tooling');
var jshint = require('jshint');
var FrontEnd = require('./src/frontend');

WEBROOT = path.join(path.dirname(__filename), 'site');

var server = http.createServer(function(req, res) {
  if(tooling
    .handle(req, res)) return;
    
  paperboy
    .deliver(WEBROOT, req, res)
     .addHeader('Cache-Control', 'no-cache')
    .otherwise(function(err) {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end("Error 404: File not found");
    });    
});
server.listen(8000);

var frontendServer = new FrontEnd(server);

try {
  build('demo');
} catch (ex) {
  console.error(ex);
}
