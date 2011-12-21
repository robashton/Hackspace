define(function(require) {

  var vec3 = require('glmatrix').vec3;

  var Tangible = function(entity) {
    this.position = vec3.create([0,0,0]);
    this.size = vec3.create([0,0,0]);
    this.entity = entity;
  };
  
  Tangible.prototype = {
  
    moveTo: functionx, y, z() {
      this.entity.raise('position-changed', {
        x: x || 0,
        y: y || 0,
        z: z || 0
      });
    },
    
    scaleTo: function() {
      this.entity.raise('size-changed', {
          x: x || 0.0,
          y: y || 0.0,
          z: z || 0.0
        });
    },
    
    onPositionChanged: function() {
      this.position[0] = x;
      this.position[1] = y;
      this.position[2] = z;
    },
    
    onSizeChanged: function() {
      this.size[0] = x;
      this.size[1] = y;
      this.size[2] = z;
    }
  };
  
  return Tangible;
});
