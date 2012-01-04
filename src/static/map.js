define(function(require) {

  var _ = require('underscore');
  var Material = require('../render/material');
  var Quad = require('../render/quad');
  var Instance = require('../render/instance');
  var Entity = require('../scene/entity');
  var RenderGraph = require('../render/rendergraph');
  var CanvasRender = require('../render/canvasrender');
  var Tile = require('./tile');


  var Map = function(data) {
    Entity.call(this, 'map');
    
    this.width = data.width;
    this.height = data.height;
    this.tilewidth = data.tilewidth;
    this.tileheight = data.tileheight;
    this.templates = data.templates;
    this.tiledata = data.tiledata;
    this.tilecountwidth = data.tilecountwidth;
    this.tilecountheight = data.tilecountheight;
    
    this.tiles = new Array(this.tilecountwidth * this.tilecountheight);
    this.models = {};  
    this.scene = null;
    this.instanceTiles = null;
    this.canvas = document.createElement('canvas'); // document.getElementById('source');  // 
    this.canvas.width = 640 + 128
    this.canvas.height = 480 + 128;
    this.context = this.canvas.getContext('2d');
    this.graph = new RenderGraph();
    this.renderer = new CanvasRender(this.context);  
    
    this.tileleft = -1;
    this.tiletop = -1;
    this.tilebottom = -1;
    this.tileright = -1;
    
    this.on('AddedToScene', this.onAddedToScene);
  };
  
  Map.prototype = {
  
    onAddedToScene: function(scene) {
      this.scene = scene; 
      this.createModels(scene.resources);
      this.createInstances();
      this.scene.graph.add(this);   
    },
    
    visible: function() { 
      return true; 
    },
    
    render: function(context) {
      
    if(this.canvas.width !== context.canvas.width + this.tilewidth || this.canvas.height !== context.canvas.height + this.tileheight) {
        this.canvas.width = context.canvas.width + this.tilewidth;
        this.canvas.height = context.canvas.height + this.tileheight;
        this.redrawBackground();
      } else {
       this.evaluateStatus();
      }     

      var offset = this.getCurrentOffset();
      var dx = 0;
      var dy = 0;
      
      this.raise('Debug', [this.tileleft, this.tileright, this.tiletop, this.tilebottom]);
                  
      context.drawImage(this.canvas, offset.x, offset.y, 
      context.canvas.width, context.canvas.height, 
        offset.x + this.tileleft * this.tilewidth, offset.y + this.tiletop * this.tileheight, 
      context.canvas.width, context.canvas.height); 
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
        this.redrawBackground();
      }
    },
    
    redrawBackground: function() { 
     
      this.graph.updateViewport(
          this.tileleft * this.tilewidth,
          this.tileright * this.tilewidth,
          this.tiletop * this.tileheight,
          this.tilebottom * this.tileheight);         
        
      this.populateGraph();      
      this.renderer.clear();
      this.renderer.draw(this.graph);      
    },
  
    populateGraph: function() {             
      this.graph.clear();
      
      for(var x = 0; x < this.tilecountwidth; x++) {
        for(var y = 0; y < this.tilecountheight ; y++) {
          var index = this.index(x, y);
          var tile = this.tiles[index];
          tile.addInstancesToGraph(this.graph);
        }
      }
    },
    
    createModels: function(resources) {
      this.models = {};
      for(var t in this.templates) {
        var template = this.templates[t];
        this.createModelForTemplate(template);     
      }
    },
    
    createInstances: function() {    
      for(var x = 0; x < this.tilecountwidth; x++) {
        for(var y = 0; y < this.tilecountheight ; y++) {
          var index = this.index(x, y);
          var tile =  new Tile(this, this.tiledata[index], x * this.tilewidth, y * this.tileheight);
          this.tiles[index] = tile;
          tile.createInstances();
        }
      }
    },
    
    tileAtCoords: function(x, y) {
      var tileX = parseInt(x / this.tilewidth);
      var tileY = parseInt(y / this.tileheight);
      var index = this.index(tileX, tileY);
      return this.tiles[index];
    },
          
    createModelForTemplate: function(template) {
      var material = new Material();
      material.diffuseTexture = this.scene.resources.get(template.texture);
      this.models[template.id] = new Quad(material);
      return this.models[template.id];
    },    
    
    index: function(x, y) {
      return x + y * this.tilecountwidth;
    }
  };
  
  _.extend(Map.prototype, Entity.prototype);
  
  return Map;

});
