define(function(require) {
  var qs = require('querystring');
  
  var Handler = function() {
    this.routes = {};
  };
  
  Handler.prototype = {
    route: function(method, path, callback) {
      this.routes[path] = {
         callback: callback,
         method: method
      };
    },
    handle: function(req, res) {
      var route = this.findRoute(req.url);
      if(!route) return false;
      if(req.method !== route.method) return false;
      this.parseFormData(req, res, function() {
        route.callback.call(this, req, res);
      });
      return true;
    },
    findRoute: function(url) {
      for(var i in this.routes) {
        if(url.indexOf(i) === 0) 
          return this.routes[i];
      }
      return null;
    },
    parseFormData: function(req, res, callback) {
      var self = this;
      if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
          req.body = qs.parse(body)             
          callback.call(self);
        });
      } 
    else callback.call(self);
    }
  };
  
  return Handler;
});
