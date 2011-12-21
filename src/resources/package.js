define(function(require) {
  var $ = require('jquery');
  

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
    has: function(path) {
      return !!this.data[path];
    },
    getData: function(path) {
      return this.data[path];
    }
  };
  
  return Package;    

});
