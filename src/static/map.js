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
  var Floor = require('./floor');


  var Map = function(data) {
    Entity.call(this, "map");
    
    this.width = data.width;
    this.height = data.height;
    this.tilewidth = data.tilewidth;
    this.tileheight = data.tileheight;
    this.templates = data.templates;
    this.tiledata = data.tiledata;
    this.tilecountwidth = data.tilecountwidth;
    this.tilecountheight = data.tilecountheight;
    
    var tileBottomRight = Coords.worldToIsometric(this.tilewidth, this.tileheight);
    var tileTopRight = Coords.worldToIsometric(this.tilewidth, 0);
    var tileBottomLeft = Coords.worldToIsometric(0, this.tileheight);
        
    this.renderTileWidth = tileTopRight.x - tileBottomLeft.x;
    this.renderTileHeight = tileBottomRight.y;
    
    this.tiles = new Array(this.tilecountwidth * this.tilecountheight);
    this.models = {};  
    this.scene = null;
    this.instanceTiles = null;
    this.canvas =  document.createElement('canvas'); // document.getElementById('source');  // 
    this.context = this.canvas.getContext('2d');
    this.graph = new RenderGraph();
    this.renderer = new CanvasRender(this.context);  
    
    this.tileleft = -1;
    this.tiletop = -1;
    this.tilebottom = -1;
    this.tileright = -1;
    this.collision = new CollisionMap(data);
    this.needsRedrawing = false;
    
    this.on('AddedToScene', this.onAddedToScene);
  };
  
  Map.prototype = {
  
    onAddedToScene: function(scene) {
      this.scene = scene; 
      this.createFloor(scene.resources);
      this.createModels(scene.resources);
      this.createInstances();
      this.scene.graph.add(this);   
    },
    
    depth: function() {
      return -1000000;
    },
      
    visible: function() { 
      return true; 
    },
    
    render: function(context) {      
      this.evaluateStatus(context);
      
      var topLeft =  Coords.worldToIsometric(this.tileleft * this.tilewidth, this.tiletop * this.tileheight);
      
      var offsetInMapCanvas = {
        x: topLeft.x - this.graph.viewport.left,
        y: topLeft.y - this.graph.viewport.top
      };
      
      var offsetInWorldCanvas = {
        x: topLeft.x - this.scene.graph.viewport.left,
        y: topLeft.y - this.scene.graph.viewport.top
      };     
      
      var offset = {
        x: offsetInWorldCanvas.x - offsetInMapCanvas.x,
        y: offsetInWorldCanvas.y - offsetInMapCanvas.y
      };
      
      var scale = this.scene.graph.getScaleForDimensions(context.canvas.width, context.canvas.height);
      
      context.save();
      context.setTransform(1,0,0,1,0,0);  
      context.drawImage(this.canvas, 0, 0 , this.canvas.width, this.canvas.height, offset.x * scale.y , offset.y * scale.y, this.canvas.width, this.canvas.height);
      context.restore();
    },
    
    forEachVisibleTile: function(callback) {
      if(this.tileleft < 0) return;
      for(var i = this.tileleft ; i <= this.tileright; i++) {
        for(var j = this.tiletop ; j <= this.tilebottom; j++) {
          var index = this.index(i, j);
          var tile = this.tiles[index];
          callback(tile);
        }
      }
    },
        
    forEachVisibleQuad: function(callback) {
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
    
    evaluateStatus: function(mainContext) {
    
      var topleft = Coords.isometricToWorld(this.scene.graph.viewport.left , this.scene.graph.viewport.top);
      var topright = Coords.isometricToWorld(this.scene.graph.viewport.right, this.scene.graph.viewport.top);        
      var bottomright = Coords.isometricToWorld(this.scene.graph.viewport.right, this.scene.graph.viewport.bottom);
      var bottomleft = Coords.isometricToWorld(this.scene.graph.viewport.left, this.scene.graph.viewport.bottom);
      
      var tileleft = parseInt( Math.min(topleft.x, bottomleft.x) / this.tilewidth);
      var tiletop = parseInt(  Math.min(topright.y, topleft.y) / this.tileheight);
      var tileright = parseInt( Math.max(bottomright.x, topright.x) / this.tilewidth) ;
      var tilebottom = parseInt( Math.max(bottomleft.y, bottomright.y) / this.tileheight) ;
      
      tileleft = Math.max(tileleft, 0);
      tiletop = Math.max(tiletop, 0);
      tileright = Math.min(tileright, this.tilecountwidth-1);
      tilebottom = Math.min(tilebottom, this.tilecountheight-1);
      
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
      var worldWidth = ((this.tileright + 1) - this.tileleft) * this.renderTileWidth;
      var worldHeight = ((this.tilebottom + 1) - this.tiletop) * this.renderTileHeight;
      
      // Then of course we need to know where the viewport starts
      var topLeft =  Coords.worldToIsometric(this.tileleft * this.tilewidth, this.tiletop * this.tileheight);
      var bottomLeft = Coords.worldToIsometric(this.tileleft * this.tilewidth, (this.tilebottom + 1) * this.tileheight);
      
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
      
      for(var i = this.tileleft ; i <= this.tileright; i++) {
        for(var j = this.tiletop ; j <= this.tilebottom; j++) {
          var index = this.index(i, j);
          var tile = this.tiles[index];
          tile.addInstancesToGraph(this.graph);
        }
      }

      this.graph.endUpdate();      
    },
    
    createFloor: function(resources) {
      this.floor = new Floor(resources);
    },
    
    createModels: function(resources) {
      this.models = {};
      for(var t in this.templates) {
        var template = this.templates[t];
        this.createModelForTemplate(template);     
      }
      this.createModelForTemplate({
        id: 'testtile',
        texture: '/main/testtile.png'
      });
    },
    
    createModelForTemplate: function(template) {
      var material = new Material();
      material.diffuseTexture = this.scene.resources.get(template.texture);
      this.models[template.id] = new Quad(material);
      return this.models[template.id];
    },
    
    createInstances: function() {    
      for(var x = 0; x < this.tilecountwidth; x++) {
        for(var y = 0; y < this.tilecountheight ; y++) {
          var index = this.index(x, y);
          var tile =  new Tile(this, this.tiledata[index], x * this.tilewidth, y * this.tileheight);
          this.tiles[index] = tile;
          tile.createInstances();
          tile.on('InstanceOpacityChanged', this.onTileInstanceOpacityChanged, this);
        }
      }
    },
    
    onTileInstanceOpacityChanged: function(instance) {
      if(instance.opacity < 1.0) {
        this.scene.graph.add(instance);
      } else {
        this.scene.graph.remove(instance);
      }
    
      this.needsRedrawing = true;
    },
    
    tileAtCoords: function(x, y) {
      var tileX = parseInt(x / this.tilewidth);
      var tileY = parseInt(y / this.tileheight);
      var index = this.index(tileX, tileY);
      return this.tiles[index];
    },
          

    index: function(x, y) {
      return x + y * this.tilecountwidth;
    },
    
    solidAt: function(x, y) {
      return this.collision.solidAt(parseInt(x), parseInt(y));
    }
  };
  
  _.extend(Map.prototype, Entity.prototype);
  
  return Map;

});
