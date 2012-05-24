define(function(require) {
  var $ = require('jquery');
  var Texture = require('./texture');
  var JsonData = require('./jsondata');
  var TextData = require('./textdata');
  var Animation = require('./animation');

  var Package = function() {
    this.data = null;
  };
  
  Package.prototype = {
    loadFrom: function(uri, callback) {
      var self = this;
      $.getJSON(uri, function(data) {
        self.data = data;
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
        return new Texture(this, path);
      } else if(path.indexOf('.shader') > 0) {
        return new TextData(this, path);
      } else if(path.indexOf('.fragment') > 0) {
        return new TextData(this, path);
      }
    }
  };
  
  return Package;    

});
