define(function(require) {
  var vec3 = require('glmatrix').vec3;

  var Camera = function(aspectRatio, fieldOfView) {
    this.aspectRatio = aspectRatio;
    this.fieldOfView = fieldOfView;
    this.centre = vec3.create([0,0,0]);
    this.distance = 512.0;
    
    this.width = 0;
    this.height = 0;
  };
  
  Camera.prototype = {
    lookAt: function(x, y, z) {
      this.centre[0] = x || 0;
      this.centre[1] = y || 0;
      this.centre[2] = z || 0;
    },
    updateViewport: function(graph) {
      this.calculateDimensions();
      graph.updateViewport(
        this.centre[0] - this.width / 2.0,
        this.centre[0] + this.width / 2.0,
        this.centre[1] - this.height / 2.0,
        this.centre[1] + this.height / 2.0
      );
    },
    calculateDimensions: function() {
      this.width = this.distance * Math.tan(this.fieldOfView);
      this.height = this.width / this.aspectRatio;
    }
  };
  
  return Camera; 
});
