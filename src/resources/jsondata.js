define(function(require) {
  var JsonData = function(pkg, path) {
    this.path = path;
    this.pkg = pkg;
    this.data = null;
  };
  
  JsonData.prototype = {
    get: function() {
      return this.data;
    },
    
    preload: function(callback) {
     this.data = this.pkg.getData(this.path);
     callback();
    },
  };
  
  return JsonData;
});
