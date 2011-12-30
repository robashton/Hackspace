define(function(require) {

  var _ = require('underscore');
  var Entity = require('../scene/entity');
  var Map = require('./map');
  var RenderGraph = require('../render/rendergraph');
  var CanvasRender = require('../render/canvasrender');

  var Scenery = function(renderWidth, renderHeight) {
    Entity.call(this, "scenery");
    
    this.tilewidth = 128;
    this.tileheight = 128;
    this.scene = null;
    this.map = new Map(2048, 2048, this.tilewidth, this.tileheight);
    this.canvas = document.createElement('canvas');
    this.canvas.width = renderWidth + 128;
    this.canvas.height = renderHeight + 128;
    this.context = this.canvas.getContext('2d');
    this.graph = new RenderGraph();
    this.renderer = new CanvasRender(this.context);
    
    this.tileleft = -1;
    this.tiletop = -1;
    this.tilebottom = -1;
    this.tileright = -1;
    
    this.on('AddedToScene', this.onAddedToScene);
    this.on('Tick', this.onTick);
  };
  
  Scenery.prototype = {
    visible: function() { 
      return true; 
    },
    render: function(context) {
      var rx = this.scene.graph.viewport.left % this.tilewidth;
      var ry = this.scene.graph.viewport.top % this.tileheight;
      var dx = 0;
      var dy = 0;
      
      this.raise('Debug', [this.tileleft, this.tileright, this.tiletop, this.tilebottom]);
                  
      context.drawImage(this.context.canvas, 
        rx, ry, 
      context.canvas.width, context.canvas.height, 
        rx + this.tileleft * this.tilewidth, ry + this.tiletop * this.tileheight, 
      context.canvas.width, context.canvas.height);
    },
    onAddedToScene: function(scene) {
      this.scene = scene; 
      this.scene.graph.add(this);   
      this.map.generateRandom(scene.resources);
    },
    onTick: function() {
         
      var tileleft = parseInt(this.scene.graph.viewport.left / this.tilewidth);
      var tiletop = parseInt(this.scene.graph.viewport.top / this.tileheight);
      var tileright = parseInt(this.scene.graph.viewport.right / this.tilewidth) + 1;
      var tilebottom = parseInt(this.scene.graph.viewport.bottom / this.tileheight) + 1;
      
      tileleft = Math.max(tileleft, 0);
      tiletop = Math.max(tiletop, 0);
      tileright = Math.min(tileright, this.map.tileCountWidth-1);
      tilebottom = Math.min(tilebottom, this.map.tileCountHeight-1);
      
      if(tileleft !== this.tileleft || 
         tiletop  !== this.tiletop || 
         tileright !== this.tileright ||
         tilebottom !== this.tilebottom) {
         
        this.tileleft = tileleft;
        this.tileright = tileright;
        this.tiletop = tiletop;
        this.tilebottom = tilebottom;
        this.redrawBackground();
      
      }
    },
    redrawBackground: function() { 
    
      this.graph.updateViewport(
          this.tileleft * this.tilewidth,
          this.tileright * this.tilewidth,
          this.tiletop * this.tileheight,
          this.tilebottom * this.tileheight);         
        
      this.map.populateGraph(this.graph);      
      this.renderer.clear();
      this.renderer.draw(this.graph);      
    }
  };
  
  _.extend(Scenery.prototype, Entity.prototype);
  
  return Scenery;

});
