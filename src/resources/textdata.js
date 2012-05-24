define(function(require) {
  var TextData = function(pkg, path) {
    this.path = path;
    this.pkg = pkg;
    this.data = null;
  };
  
  TextData.prototype = {
    get: function() {
      return this.data;
    },
    
    preload: function(callback) {
     this.data = this.pkg.getData(this.path);
     callback();
    },
  };
  
  return TextData;
});
