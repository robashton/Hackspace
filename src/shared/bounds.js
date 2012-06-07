define(function(require) {
  var _ = require('underscore');
  var Coords = require('./coords');
  var vec3 = require('glmatrix').vec3;
  
  var Bounds = function(position, size) {
    this.position = position || vec3.create([0,0,0]);
    this.size = size || vec3.create([0,0,0]);
    this.dirty = true;
    this.renderQuad = {};
    this.selectionQuad = {};
  };

  Bounds.prototype = {
    getRenderQuad: function() {
      this.checkState();
      var bottomLeft = Coords.worldToIsometric(this.position[0], this.position[1] + this.size[1]);      
      var width = this.size[0] + this.size[1];
      var height = this.size[2];
      return {
        x: bottomLeft.x,
        y: bottomLeft.y - (height),
        width: width,
        height: height
      };
    },
    getSelectionQuad: function() {
      this.checkState();
      return this.selectionQuad;
    },
    getCollisionQuad: function() {
      return {
        x: this.position[0],
        y: this.position[1],
        width: this.size[0],
        height: this.size[1],
        circle: {
          radius: Math.max(this.size[0] / 2.0, this.size[1] / 2.0),
          x: this.position[0],
          y: this.position[1]
        }
      }
    },
    updatePosition: function(x, y, z) {
      this.position[0] = x;
      this.position[1] = y;
      this.position[2] = z;
      this.dirty = true;
    },
    updateSize: function(x, y, z) {
      this.size[0] = x;
      this.size[1] = y;
      this.size[2] = z;
      this.dirty = true;
    },
    checkState: function() {
      if(!this.dirty) return;
      this.dirty = false;

      this.createRenderQuad();
      this.createSelectionQuad();
      this.createCollisionQuad();
    },
    createRenderQuad: function() {

    },
    createSelectionQuad: function() {

    },
    createCollisionQuad: function() {

    }
  };


  return Bounds;

});
