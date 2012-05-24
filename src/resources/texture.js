define(function(require) {
  var Texture = function(pkg, path) {
    this.img = null;
    this.texture = null;
    this.path = path;
    this.pkg = pkg;
    this.loaded = false;
  };
  
  Texture.prototype = {
    get: function() {
      return this.texture;
    },
    
    str: function() {
      return this.img.src;
    },

    preload: function(callback, context) {
     var data = this.pkg.getData(this.path);
     this.img = new Image();
     var self = this;
     this.img.onload = function() {
       self.texture = context.createTexture();
       context.bindTexture(context.TEXTURE_2D, self.texture);
       context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, false);
       context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, self.img);
       context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.LINEAR);
       context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
       context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
       callback();
     };
     this.img.src = "data:image/png;base64," + data;
     this.loaded = true;
    },
  };
  
  return Texture;
});

