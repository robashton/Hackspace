define(function(require) {
  var Animation = function(factory, path) {
    this.path = path;
    this.factory = factory;
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
     this.data = this.factory.getData(this.path);
     callback();
    },
  };
  
  return Animation;
});
