define(function(require) {

  var _ = require('underscore');
  var Material = require('../render/material');
  var Quad = require('../render/quad');
  var Instance = require('../render/instance');
  var Entity = require('../scene/entity');
  var RenderGraph = require('../render/rendergraph');
  var CanvasRender = require('../render/canvasrender');
  var Tile = require('./tile');
  var CollisionMap = require('./collisionmap');
  var Coords = require('../shared/coords');
  var Grid = require('../editor/grid');
  var CONST = require('./consts');

  var Map = function(tiles) {
    Entity.call(this, "map");    
        
    this.scene = null;
    this.instanceTiles = null;
    this.canvas = null; 
    this.context = null; 
    this.graph = null; 
    this.renderer = null; 
    this.tiles = tiles;

    
    this.tileleft = -1;
    this.tiletop = -1;
    this.tilebottom = -1;
    this.tileright = -1;
    this.needsRedrawing = false;
    
    this.on('AddedToScene', this.onAddedToScene);
    this.tiles.on('TileLoaded', this.onTileLoaded, this);
    this.tiles.on('InstanceOpacityChanged', this.onTileInstanceOpacityChanged, this);
  };
  
  Map.prototype = {
  
    onAddedToScene: function(scene) {
      this.scene = scene;
      this.scene.graph.add(this);   
    },

    onTileLoaded: function(tile) {
      this.needsRedrawing = true;
    },
    
    depth: function() {
      return -1000000;
    },
      
    visible: function() { 
      return true; 
    },
    
    render: function(context) {      
      this.evaluateStatus(context);
      
      var topLeft =  Coords.worldToIsometric(this.tileleft * CONST.TILEWIDTH, this.tiletop * CONST.TILEHEIGHT);
      
      var offsetInMapCanvas = {
        x: topLeft.x - this.graph.viewport.left,
        y: topLeft.y - this.graph.viewport.top
      };
      
      var offsetInWorldCanvas = {
        x: topLeft.x - this.scene.graph.viewport.left,
        y: topLeft.y - this.scene.graph.viewport.top
      };     
      
      var offset = {
        x: offsetInMapCanvas.x - offsetInWorldCanvas.x,
        y: offsetInMapCanvas.y - offsetInWorldCanvas.y
      };
      
      var scale = this.scene.graph.getScaleForDimensions(context.canvas.width, context.canvas.height);
      
      var sx = offset.x, sy = offset.y;
      var sw = context.canvas.width, sh = context.canvas.height;
      var dx = 0, dy = 0;
      var dw = context.canvas.width, dh = context.canvas.height;
      
      if(offset.x < 0) {
        sx = 0; 
        dx = offset.x;
        sw += offset.x;
        dw += offset.x;
      }
      if(offset.y < 0) {
        sy = 0; 
        dy = -offset.y;
        sh += offset.y;
        dh += offset.y;
      }
      
      context.save();
      context.setTransform(1,0,0,1,0,0);  
      context.drawImage(this.canvas, sx * scale.x, sy * scale.y , sw, sh, dx * scale.x, dy * scale.y , dw, dh);
      context.restore();
    },
    
    forEachVisibleTile: function(callback) {
      if(this.tileleft < 0) return;
      for(var i = this.tileleft ; i <= this.tileright; i++) {
        for(var j = this.tiletop ; j <= this.tilebottom; j++) {
           this.tiles.withTile(i, j, callback)
        }
      }
    },
        
    forEachVisibleQuad: function(callback) {
      for(var i = this.tileleft ; i <= this.tileright; i++) {
        for(var j = this.tiletop ; j <= this.tilebottom; j++) {
          var left = i * CONST.TILEWIDTH;
          var right = left + CONST.TILEWIDTH;
          var top = j * CONST.TILEHEIGHT;
          var bottom = top + CONST.TILEHEIGHT;
          callback(left, top, right, bottom);          
        }      
      }
    },
    
    initializeContext: function() {
      this.canvas = document.createElement('canvas');
      this.context = this.canvas.getContext('2d');
      this.graph = new RenderGraph();
      this.renderer = new CanvasRender(this.context);  
    },
    
    evaluateStatus: function(mainContext) {
      if(!this.canvas) this.initializeContext();
    
      var topleft = Coords.isometricToWorld(this.scene.graph.viewport.left , this.scene.graph.viewport.top);
      var topright = Coords.isometricToWorld(this.scene.graph.viewport.right, this.scene.graph.viewport.top);        
      var bottomright = Coords.isometricToWorld(this.scene.graph.viewport.right, this.scene.graph.viewport.bottom);
      var bottomleft = Coords.isometricToWorld(this.scene.graph.viewport.left, this.scene.graph.viewport.bottom);
      
      var tileleft = parseInt( Math.min(topleft.x, bottomleft.x) / CONST.TILEWIDTH);
      var tiletop = parseInt(  Math.min(topright.y, topleft.y) / CONST.TILEHEIGHT);
      var tileright = parseInt( Math.max(bottomright.x, topright.x) / CONST.TILEWIDTH) ;
      var tilebottom = parseInt( Math.max(bottomleft.y, bottomright.y) / CONST.TILEHEIGHT) ;
           
      if(tileleft !== this.tileleft || 
         tiletop  !== this.tiletop || 
         tileright !== this.tileright ||
         tilebottom !== this.tilebottom) {        
                 
        this.tileleft = tileleft;
        this.tileright = tileright;
        this.tiletop = tiletop;
        this.tilebottom = tilebottom;
        this.needsRedrawing = true;
      }
      
      if(this.needsRedrawing) {
        this.needsRedrawing = false;
        this.redrawBackground(mainContext);
      }
    },
    
    redrawBackground: function(mainContext) {
      
      // So we know how many units we'll need in order to render all the  current partially visible tiles
      var worldWidth = ((this.tileright + 1) - this.tileleft) * CONST.RENDERTILEWIDTH;
      var worldHeight = ((this.tilebottom + 1) - this.tiletop) * CONST.RENDERTILEHEIGHT;
      
      // Then of course we need to know where the viewport starts
      var topLeft =  Coords.worldToIsometric(this.tileleft * CONST.TILEWIDTH, this.tiletop * CONST.TILEHEIGHT);
      var bottomLeft = Coords.worldToIsometric(this.tileleft * CONST.TILEWIDTH, (this.tilebottom + 1) * CONST.TILEHEIGHT);
      
      // That gives us the ability to set up the viewport
      this.graph.updateViewport(
         bottomLeft.x,
         bottomLeft.x + worldWidth,
         topLeft.y,
         topLeft.y + worldHeight
      );
           
      // This is very well and good, but our personal canvas needs to be sized appropriately for this so sizes match up
      var mainScaleFactor = this.scene.graph.getScaleForDimensions(mainContext.canvas.width, mainContext.canvas.height);
      this.canvas.width = this.graph.width() * mainScaleFactor.x;
      this.canvas.height = this.graph.height() * mainScaleFactor.y;
        
      // And with that all set, we can render all the visible tiles
      this.populateGraph();      
      this.renderer.clear();
      this.renderer.draw(this.graph);      
 //     this.renderDebugGrid(this.context);
    },
    
    renderDebugGrid: function(context) {
      context.save(); 
      this.graph.uploadTransforms(context);
      
      context.strokeStyle = 'rgba(100, 100, 100, 1.0)';
      context.lineWidth = 1.25;
          
      context.beginPath();
      this.forEachVisibleQuad(function(left, top, right, bottom) {
      
        var topleft = Coords.worldToIsometric(left, top);
        var topright = Coords.worldToIsometric(right, top);        
        var bottomright = Coords.worldToIsometric(right, bottom);
        var bottomleft = Coords.worldToIsometric(left, bottom);
         
        context.moveTo(topleft.x, topleft.y);
        context.lineTo(topright.x, topright.y);
        context.lineTo(bottomright.x, bottomright.y);
        context.lineTo(bottomleft.x, bottomleft.y);
        context.lineTo(topleft.x, topleft.y);
      });
      context.stroke();
      context.restore();
    
    },
  
    populateGraph: function() {             
      this.graph.clear();
      this.graph.beginUpdate();
      var self = this;
      for(var i = this.tileleft ; i <= this.tileright; i++) {
        for(var j = this.tiletop ; j <= this.tilebottom; j++) {
          this.tiles.withTile(i, j, function(tile) {
            tile.addInstancesToGraph(self.graph);
          });
        }
      }
      this.graph.endUpdate();      
    },
 
    onTileInstanceOpacityChanged: function(instance) {
      if(instance.opacity < 1.0) {
        this.scene.graph.add(instance);
      } else {
        this.scene.graph.remove(instance);
      }    
      this.needsRedrawing = true;
    },
    
    solidAt: function(x, y) {
      return this.tiles.solidAt(x, y);
    }
  };
  
  _.extend(Map.prototype, Entity.prototype);
  
  return Map;

});
