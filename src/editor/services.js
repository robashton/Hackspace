define(function(require) {
  var _ = require('underscore');
  var Handler = require('../shared/handler');
  var fs = require('fs');
  var path = require('path');
  
  var Services = function(baseDir) {
    Handler.call(this);
    this.baseDir = baseDir;
    this.route('POST', '/services/savemap', this.savemap);    
  };
  
  Services.prototype = {
    savemap: function(req, res) {
      var self = this;
      fs.writeFile(path.join(this.baseDir, 'apps/demo/assets/main/world.json'), req.body.map, function() {
        self.success(req, res);
      });
    },
    success: function(req, res) {
      res.writeHead(200, "Content-Type: application/json");
      res.write(JSON.stringify({
        success: true
      }));
      res.end();
    }
  };
  
  _.extend(Services.prototype, Handler.prototype);
  
  return Services;

});
