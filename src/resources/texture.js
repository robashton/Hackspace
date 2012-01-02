define(function(require) {
  var Texture = function(factory, path) {
    this.img = null;
    this.path = path;
    this.factory = factory;
    this.loaded = false;
  };
  
  Texture.prototype = {
    get: function() {
      return this.img;
    },
    
    preload: function(callback) {
     var data = this.factory.getData(this.path);
     this.img = new Image();
     this.img.onload = callback;
     this.img.src = "data:image/png;base64," + data;
     this.loaded = true;
    },
  };
  
  return Texture;
});
