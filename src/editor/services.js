define(function(require) {
  var _ = require('underscore');
  var Handler = require('../shared/handler');
  var fs = require('fs');
  var path = require('path');
  var Paths = require('../shared/paths');

  var Services = function(baseDir) {
    Handler.call(this);
    this.baseDir = baseDir;
    this.route('POST', '/services/savetile', this.savetile);
    this.route('GET', '/services/gettile', this.gettile);
    this.route('GET', '/services/getlibrary', this.getlibrary);
  };
  
  Services.prototype = {
    savetile: function(req, res) {
      var self = this;
      var x = req.body.x;
      var y = req.body.y;      
      var filename = Paths.filenameForTile(x, y);
      filename = path.join(this.baseDir, 'apps/demo/dynamic/world/') + filename;
      fs.writeFile(filename, req.body.map, function() {
        self.success(req, res);
      });
    },
    getlibrary: function(req, res) {
      var self = this;
      fs.readFile(path.join(this.baseDir, 'apps/demo/assets/editor/library.json'), function(err, data) {
        if(err) throw err;
        self.success(req, res, data);
      });
    },
    gettile: function(req, res) {
      var self = this;
      var x = req.query.x;
      var y = req.query.y;
      var filename = Paths.filenameForTile(x, y);
      filename = path.join(this.baseDir, 'apps/demo/dynamic/world/') + filename;
      fs.readFile(filename, 'utf8', function(err, data) {
        if(err) {
          self.failure(req, res, err);
        }
        else {
          self.success(req, res, data);
        }
      });
    },
    failure: function(req, res, err) {
      res.writeHead(500, "Content-Type: application/text");
      res.write(err.toString());
      res.end();
    },
    success: function(req, res, payload) {
      res.writeHead(200, "Content-Type: application/json");
      res.write(payload || JSON.stringify({
        success: true
      }));
      res.end();
    }
  };
  
  _.extend(Services.prototype, Handler.prototype);
  
  return Services;

});
