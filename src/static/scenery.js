define(function(require) {

  var _ = require('underscore');
  var Entity = require('../scene/entity');
  var Map = require('./map');
  var RenderGraph = require('../render/rendergraph');

  var Scenery = function(renderWidth, renderHeight) {
    Entity.call(this, "scenery");
    
    this.scene = null;
    this.map = new Map(2048, 2048, 128, 128);
    this.map.generateRandom();
    this.canvas = document.createElement('canvas');
    this.canvas.width = renderWidth;
    this.canvas.height = renderHeight;
    this.context = this.canvas.getContext('2d');
    
    
    
    this.on('AddedToScene', this.onAddedToScene);
    this.on('Tick', this.onTick);
  };
  
  Scenery.prototype = {
    onAddedToScene: function(scene) {
      this.scene = scene;    
    },
    onTick: function() {
      
      // Look at the current viewport
      
      // Compare it to what we currently have drawn
      
      // Determine if we need to re-draw and update the renderable
      var graph = new RenderGraph();
      
    }
  };
  
  _.extend(Scenery.prototype, Entity.prototype);
  
  return Scenery;

});
