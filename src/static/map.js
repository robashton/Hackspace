define(function(require) {

  var Material = require('../render/material');
  var Quad = require('../render/quad');
  var Instance = require('../render/instance');

  var Map = function(width, height, tilewidth, tileheight) {
    this.width = width;
    this.height = height;
    this.tilewidth = tilewidth;
    this.tileheight = tileheight;
    this.tileCountWidth = parseInt(this.width / this.tileheight);
    this.tileCountHeight = parseInt(this.height / this.tileheight);
    this.tiles = new Array(this.tileCountWidth * this.tileCountHeight);
    this.templates = {};
    this.createEmptyTiles();
  };
  
  Map.prototype = {
    populateGraph: function(graph) {             
      graph.clear();
      
      for(var x = 0; x < this.tileCountWidth; x++) {
        for(var y = 0; y < this.tileCountHeight ; y++) {
          var index = this.index(x, y);
          for(var i = 0; i < this.tiles[index].length ; i++) {
            graph.add(this.tiles[index][i]);            
          }          
        }
      }
    },
    
    createEmptyTiles: function() {
      for(var x = 0; x < this.tileCountWidth; x++) {
        for(var y = 0; y < this.tileCountHeight ; y++) {
          var index = this.index(x,y);
          var tilex = x * this.tilewidth;
          var tiley = y * this.tileheight;
          this.tiles[index] = [];
        }
      }
    },
    
    generateRandom: function(resources) {

      var treeMaterial = new Material();
      treeMaterial.diffuseTexture = resources.get('/main/tree.png');
      this.models = {};
      this.models.tree = new Quad(treeMaterial);
      
      for(var x = 0; x < this.tileCountWidth; x++) {
        for(var y = 0; y < this.tileCountHeight ; y++) {
          var index = this.index(x,y);
          var tilex = x * this.tilewidth;
          var tiley = y * this.tileheight;          
          var treeCount = Math.random() * 5;
          
          for(var i = 0 ; i < treeCount; i++) {
            var xloc = Math.random() * this.tilewidth;
            var yloc = Math.random() * this.tileheight;
            
            var instance = new Instance(this.models.tree);
            instance.scale(25,25, 0);
            instance.translate(xloc + tilex, yloc + tiley, 0);
            
 
            this.tiles[index].push(instance);
          }
        }     
      }    
    },
    index: function(x, y) {
      return x + y * this.tileCountWidth;
    }
  };
  
  return Map;

});
