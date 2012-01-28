define(function(require) {
  var JsonData = function(pkg, path) {
    this.path = path;
    this.pkg = pkg;
  };
  
  JsonData.prototype = {
    get: function() {
      console.warn('Access to ignored resource, this needs stamping out');
      return null;
    },
    
    preload: function(callback) {
     callback();
    },
  };
  
  return JsonData;
});
