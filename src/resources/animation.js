define(function(require) {
  var Animation = function(pkg, path) {
    this.path = path;
    this.pkg = pkg;
    this.data = null;
  };
  
  Animation.prototype = {
    get: function() {
      return this.data;
    },
    
    frameCountForAnimation: function(animation) {
      return this.data[animation].frameCount;
    },
    
    preload: function(callback) {
     this.data = this.pkg.getData(this.path);
     callback();
    },
  };
  
  return Animation;
});
