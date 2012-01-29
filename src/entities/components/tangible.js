define(function(require) {

  var vec3 = require('glmatrix').vec3;

  var Tangible = function(x, y, width, height) {
    this.position = vec3.create([x,y,0]);
    this.size = vec3.create([width, width, height]);
    this.rotation = 0;
  };
  
  Tangible.prototype = {
  
    moveTo: function(x, y, z) {
      this.parent.raise('PositionChanged', {
        x: x || 0,
        y: y || 0,
        z: z || 0
      });
    },
    
    scaleTo: function(x, y, z) {
      this.parent.raise('SizeChanged', {
          x: x || 0.0,
          y: y || 0.0,
          z: z || 0.0
        });
    },
    
    rotateTo: function(x) {
      this.parent.raise('RotationChanged', {
        x: x
      });
    },
    
    getPosition: function() {
      return this.position;
    },

    getRadius: function() {
      return Math.max(this.size[0], this.size[1]) / 2.0;
    },
        
    onAddedToScene: function(scene) {
      this.scene = scene;
      this.moveTo(this.position[0], this.position[1], this.position[2]);
      this.scaleTo(this.size[0], this.size[1], this.size[2]);      
    },   
    
    onPositionChanged: function(data) {
      this.position[0] = data.x;
      this.position[1] = data.y;
      this.position[2] = data.z;
    },
    
    onSizeChanged: function(data) {
      this.size[0] = data.x;
      this.size[1] = data.y;
      this.size[2] = data.z;
    },
    
    onRotationChanged: function(data) {
      this.rotation = data.x;
    },
    _out: function(data) {
      data.rotation = this.rotation;
      data.x = this.position[0];
      data.y = this.position[1];
    },
    _in: function(data) {
      this.rotation = data.rotation;
      this.position[0] = data.x;
      this.position[1] = data.y;
    }
  };
  
  return Tangible;
});
