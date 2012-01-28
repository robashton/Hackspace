define(function(require) {
  var fs = require('fs');
  var IgnoredResource = require('./ignoredresource');
  var JsonData = require('./jsondata');
  var Animation = require('./animation');
  
  var ServerPackage = function() {
    this.data = null;
  };
  
  ServerPackage.prototype = {
    loadFrom: function(uri, callback) {
      var self = this;
      fs.readFile(uri, function(err, data) {
        self.data = JSON.parse(data);
        callback();
      });
    },
    each: function(callback) {
      for(var k in this.data) {
        callback(k);
      }
    },
    has: function(path) {
      return !!this.data[path];
    },
    getData: function(path) {
      return this.data[path];
    },
    createResource: function(path) {
      if(path.indexOf('meta.json') > 0) {
        return new Animation(this, path);
      }
      else if(path.indexOf('.json') > 0) {
        return new JsonData(this, path);
      } else if(path.indexOf('.png') > 0) {
        return new IgnoredResource(this, path);
      }
    }
  };
  
  return ServerPackage;    

});
