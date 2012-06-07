define(function(require) {

  var _ = require('underscore');
  var mat4 = require('glmatrix').mat4;
  var Coords = require('../shared/coords');
  var Selections = function(resources) {
     this.worldTransform = mat4.create();
     this.selectedTexture = resources.get('main/selection-indicator.png');
  };

  Selections.prototype = {
    add: function(instance) {
      instance.on('BeforeRender', this.onBeforeRenderInstance, this);
    },
    remove: function(instance) {
      instance.off('BeforeRender', this.onBeforeRenderInstance, this);
    },
    onBeforeRenderInstance: function(data, instance) {
      var shader = data.shader,
          context = data.context;

      var quad = instance.bounds.getCollisionQuad();
      var topLeft = Coords.worldToIsometric(quad.x, quad.y);
      var bottomLeft = Coords.worldToIsometric(quad.x, quad.y + quad.height);
      mat4.identity(this.worldTransform);
      mat4.translate(this.worldTransform, [bottomLeft.x, topLeft.y, 0]);
      mat4.scale(this.worldTransform, [quad.width * 2, quad.height, 1.0]);
      shader.uploadWorldTransform(this.worldTransform);
      shader.uploadTextureOne(this.selectedTexture.get());
      shader.setGlobalAlpha(1.0);
      context.drawArrays(context.TRIANGLE_STRIP, 0, 4); 
    }
  };

  return Selections;

});
