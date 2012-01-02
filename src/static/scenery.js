define(function(require) {

  var _ = require('underscore');
  var Entity = require('../scene/entity');
  var Map = require('./map');
  var RenderGraph = require('../render/rendergraph');
  var CanvasRender = require('../render/canvasrender');

  var Scenery = function(renderWidth, renderHeight, tileWidth, tileHeight) {
    Entity.call(this, "scenery");
    
    this.tilewidth = tileWidth;
    this.tileheight = tileHeight;
    this.scene = null;
    this.map = null;
    this.canvas = document.createElement('canvas');
    this.canvas.width = renderWidth + tileWidth;
    this.canvas.height = renderHeight + tileHeight;
    this.context = this.canvas.getContext('2d');
    this.graph = new RenderGraph();
    this.renderer = new CanvasRender(this.context);
    
    this.tileleft = -1;
    this.tiletop = -1;
    this.tilebottom = -1;
    this.tileright = -1;
    
    this.on('AddedToScene', this.onAddedToScene);
  };
  
  Scenery.prototype = {
    loadMap: function(map) {
      this.map = map;
    },
    visible: function() { 
      return true; 
    },
    render: function(context) {   
      if(!this.map) return;
      this.evaluateStatus();
      
      var offset = this.getCurrentOffset();
      var dx = 0;
      var dy = 0;
      
      this.raise('Debug', [this.tileleft, this.tileright, this.tiletop, this.tilebottom]);
                  
      context.drawImage(this.context.canvas, 
        offset.x, offset.y, 
      context.canvas.width, context.canvas.height, 
        offset.x + this.tileleft * this.tilewidth, offset.y + this.tiletop * this.tileheight, 
      context.canvas.width, context.canvas.height); 
    },
    onAddedToScene: function(scene) {
      this.scene = scene; 
      this.scene.graph.add(this);   
    },
    getCurrentOffset: function() {
      return {
        x: this.scene.graph.viewport.left % this.tilewidth,
        y: this.scene.graph.viewport.top % this.tileheight
      };
    },
    forEachVisibleTile: function(callback) {
      for(var i = this.tileleft ; i <= this.tileright; i++) {
        for(var j = this.tiletop ; j <= this.tilebottom; j++) {
          var left = i * this.tilewidth;
          var right = left + this.tilewidth;
          var top = j * this.tileheight;
          var bottom = top + this.tileheight;
          callback(left, top, right, bottom);          
        }      
      }
    },
    evaluateStatus: function() {
      
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
