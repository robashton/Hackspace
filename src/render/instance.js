define(function(require) {

  var _ = require('underscore');
  var vec3 = require('glmatrix').vec3;
  var Coords = require('../shared/coords');
  var Eventable = require('../shared/eventable');

  var Instance = function(model) {
    Eventable.call(this);
    this.model = model;
    this.position = vec3.create([0,0,0]);
    this.size = vec3.create([0,0,0]);
    this.rotation = 0;
    this.opacity = 1.0;
    this.forcedDepth = null;
    this.drawFloor = false;
  };
  
  Instance.prototype = {
    visible: function(viewport) {
      return true;
    },
    scale: function(x, y, z) {
      this.size[0] = x || 0;
      this.size[1] = y || 0;
      this.size[2] = z || 0;
    },
    setOpacity: function(value) {
      if(this.opacity != value) {
        this.opacity = value;
        this.raise('OpacityChanged');
      }
    },
    translate: function(x, y, z) {
      this.position[0] = x || 0;
      this.position[1] = y || 0;
      this.position[2] = z || 0;
    },
    rotate: function(x) {
      this.rotation = x;
    },
    render: function(context) {     
      this.model.upload(context);
      this.model.render(context, this);
    },
    depth: function() {
      return this.forcedDepth || Coords.worldToIsometric(this.position[0], this.position[1]).y;
    },
    forceDepth: function(value) {
      this.forcedDepth = value;
    },
    getQuad: function() {
      var bottomLeft = Coords.worldToIsometric(this.position[0], this.position[1] + this.size[1]);      
      var width = this.size[0] + this.size[1];
      var height = this.size[2];
      return {
        x: bottomLeft.x,
        y: bottomLeft.y - height,
        width: width,
        height: height
      }
    },
    intersectWithWorldCoords: function(x, y) {
      var screen = Coords.worldToIsometric(x, y);  
      var model = this.getQuad();     
              
      if(screen.x < model.x) return false;
      if(screen.x > model.x + model.width) return false;
      if(screen.y < model.y) return false;
      if(screen.y > model.y + model.height) return false;
      
      return true;
    },
    coversQuad: function(quad) {
      var selfQuad = this.getQuad();
      if(selfQuad.x > quad.x + quad.width) return false;
      if(selfQuad.y > quad.y + quad.height) return false;
      if(selfQuad.x + selfQuad.width < quad.x) return false;
      if(selfQuad.y + selfQuad.height < quad.y) return false;
      return true;
    },
  };
  _.extend(Instance.prototype, Eventable.prototype);
  
  return Instance;
});
