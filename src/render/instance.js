define(function(require) {

  var _ = require('underscore');
  var vec3 = require('glmatrix').vec3;
  var mat4 = require('glmatrix').mat4;
  var Coords = require('../shared/coords');
  var Eventable = require('../shared/eventable');
  var mat4 = require('glmatrix').mat4;
  var Bounds = require('../shared/bounds');

  var Instance = function(model) {
    Eventable.call(this);
    this.model = model;
    this.bounds = new Bounds();
    this.rotation = 0;
    this.opacity = 1.0;
    this.forcedDepth = null;
    this.worldTransform = mat4.create();
  };
  
  Instance.prototype = {
    visible: function(viewport) {
      return true;
    },
    scale: function(x, y, z) {
      this.bounds.updateSize(x, y, z);
    },
    setOpacity: function(value) {
      if(this.opacity != value) {
        this.opacity = value;
        this.raise('OpacityChanged');
      }
    },
    translate: function(x, y, z) {
      this.bounds.updatePosition(x, y, z);
    },
    rotate: function(x) {
      this.rotation = x;
    },

    render: function(shader, context) {
      mat4.identity(this.worldTransform);
      var quad = this.bounds.getRenderQuad();

      // On a list of things Not To Do, this is Pretty High Up There
      // TODO: This probably fits in the same fix for the below hack
      this.raise('BeforeRender', {
        shader: shader,
        context: context,
        quad: quad
      });

      // TODO: This will be a bottleneck, sort it out mister.
      mat4.translate(this.worldTransform, [quad.x, quad.y, 0]);
      mat4.scale(this.worldTransform, [quad.width, quad.height, 1.0]);
      shader.uploadWorldTransform(this.worldTransform);
      shader.uploadTextureOne(this.model.image('diffuseTexture'));
      shader.setGlobalAlpha(this.opacity);
      context.drawArrays(context.TRIANGLE_STRIP, 0, 4);
    },
    depth: function() {
      return this.forcedDepth || Coords.worldToIsometric(this.bounds.position[0], this.bounds.position[1]).y;
    },
    forceDepth: function(value) {
      this.forcedDepth = value;
    },
    getQuad: function() {
      return this.bounds.getRenderQuad();
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