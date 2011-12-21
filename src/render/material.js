define(function(require) {
  var Color = require('./color');

  var Material = function() {
   
  };
  
  Material.prototype = {
    diffuse: new Color(255,255,255, 255),  
    diffuseTexture: null
  };
  return Material;
  
});
