define(function(require) {

  var _ = require('underscore');
  var Entity = require('../scene/entity');
  var RenderGraph = require('../render/rendergraph');
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
    this.graph = null; 
    this.tiles = tiles;
    this.graph = new RenderGraph();
    
    this.tileleft = -1;
    this.tiletop = -1;
    this.tilebottom = -1;
    this.tileright = -1;
    
    this.on('AddedToScene', this.onAddedToScene);
    this.tiles.on('TileLoaded', this.onTileLoaded, this);
  };
  
  Map.prototype = {
  
    onAddedToScene: function(scene) {
      this.scene = scene;
      this.scene.graph.add(this);   
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
    
    evaluateStatus: function(mainContext) {
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
        this.populateGraph();
      }
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
   
    solidAt: function(x, y) {
      return this.tiles.solidAt(x, y);
    }
  };
  
  _.extend(Map.prototype, Entity.prototype);
  
  return Map;

});
