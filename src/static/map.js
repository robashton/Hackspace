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

  var Map = function(tiles, settings) {
    Entity.call(this, "map");    
        

    this.settings = settings;
    this.scene = null;
    this.instanceTiles = null;
    this.canvas = null; 
    this.context = null; 
    this.offscreencanvas = null;
    this.offscreencontext = null;
    this.graph = null; 
    this.renderer = null; 
    this.tiles = tiles;
    
    this.tileleft = -1;
    this.tiletop = -1;
    this.tilebottom = -1;
    this.tileright = -1;
    this.needsRedrawing = false;
    this.framesElapsedSinceNeededRedrawing = 0;
    
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

    upload: function(shader) {
      
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
      
      var destinationScale = this.scene.graph.getScaleForDimensions(context.canvas.width, context.canvas.height);
      var sourceScale = this.graph.getScaleForDimensions(this.canvas.width, this.canvas.height);

      var sx = -offset.x, sy = -offset.y;
      sx = sx * sourceScale.x;
      sy = sy * sourceScale.y;
      var elementScale = (1.0 / this.settings.backgroundScaleFactor()) * this.settings.outputScaleFactor();

      $(this.canvas).css({
        '-webkit-transform-origin-x': -sx + 'px',
        '-webkit-transform-origin-y': -sy + 'px'
      });
      $(this.canvas).css('-webkit-transform', 'translate3d(' + sx + 'px,' + sy + 'px, 0px)' +  
                                            ' scale(' + elementScale + ',' + elementScale + ')');  
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
      this.canvas =  document.getElementById('background');
      this.offscreencanvas = document.createElement('canvas');
      this.offscreencontext = this.offscreencanvas.getContext('2d');
      this.context = this.canvas.getContext('2d');
      this.graph = new RenderGraph();
      this.renderer = new CanvasRender(this.offscreencontext);  
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

      var tileswidth = tileright - tileleft;
      var tilesheight = tilebottom - tiletop;
              
      // Force a square - this will reduce the number of required re-draws                  
      if(tileswidth < tilesheight)
        tileright += (tilesheight - tileswidth);
      else if(tilesheight < tileswidth)
        tilebottom += (tileswidth - tilesheight);

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
        if(this.framesElapsedSinceNeededRedrawing++ < 5)
          return;
        this.framesElapsedSinceNeededRedrawing = 0;
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
      this.offscreencanvas.width = (this.graph.width() * (mainScaleFactor.x * this.settings.backgroundScaleFactor()));
      this.offscreencanvas.height = (this.graph.height() * (mainScaleFactor.y * this.settings.backgroundScaleFactor()));
        
      // And with that all set, we can render all the visible tiles
      this.populateGraph();      
      this.renderer.clear();
      this.renderer.draw(this.graph);

      // Now blit across
      this.canvas.width = this.offscreencanvas.width;
      this.canvas.height = this.offscreencanvas.height;
      this.context.drawImage(this.offscreencanvas, 0, 0, this.canvas.width, this.canvas.height);
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
