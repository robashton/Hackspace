define(function(require) {
  var vec3 = require('glmatrix').vec3;
  var Coords = require('../shared/coords');

  var Camera = function(settings, aspectRatio, fieldOfView) {
    this.aspectRatio = aspectRatio;
    this.fieldOfView = fieldOfView;
    this.centre = vec3.create([0,0,0]);
    this.distance = 150.0;
    this.settings = settings;
    this.width = 0;
    this.height = 0;
    
    if(this.settings) {
      this.settings.on('updated', this.updateFromSettings, this);
      this.updateFromSettings()
    }
  };
  
  Camera.prototype = {
    lookAt: function(x, y, z) {
      this.centre[0] = x || 0;
      this.centre[1] = y || 0;
      this.centre[2] = z || 0;
    },
    move: function(x, y, z) {
      this.lookAt(this.centre[0] + x, this.centre[1] + y, this.centre[2] + z);
    },
    updateViewport: function(graph) {
      this.calculateDimensions();
            
      var isometric = Coords.worldToIsometric(this.centre[0], this.centre[1]);
           
      var left = isometric.x - (this.width / 2.0);
      var top = isometric.y - (this.height / 2.0);
            
      var right = left + this.width;
      var bottom = top + this.height;
            
      graph.updateViewport(left, right, top, bottom);
    },
    setAspectRatio: function(aspectRatio) {
      this.aspectRatio = aspectRatio;
      this.calculateDimensions();
    },
    calculateDimensions: function() {
      this.width = this.distance * Math.tan(this.fieldOfView);
      this.height = this.width / this.aspectRatio;
    },
    updateFromSettings: function() {
      this.setAspectRatio(this.settings.aspectRatio);
    }
  };
  
  return Camera; 
});
