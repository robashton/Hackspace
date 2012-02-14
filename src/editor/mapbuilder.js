define(function(require) {
  
  var _ = require('underscore');
  var Map = require('../static/map');
  var Instance = require('../render/instance');
  var BitField = require('../shared/bitfield');

  var MapBuilder = function(data) {
    Map.call(this, data);
    this.entities = data.entities || {};
  };
  
  MapBuilder.prototype = {
  
    addEntity: function(id, type, data) {
      console.log(id, type, data);
      this.entities[id] = {
        type: type,
        data: data
      };
    },
  
    getMapData: function() {
      var map = {};  
      this.populateMapMetadata(map);
      this.populateMapTemplates(map);
      this.populateMapTiles(map);
      this.populateMapCollision(map);
      this.populateEntities(map);
      return map;
    },
    
    populateEntities: function(map) {
      map.entities = this.entities;
    },
    
    populateMapMetadata: function(map) {
      map.width = this.width;
      map.height = this.height;
      map.tilewidth = this.tilewidth;
      map.tileheight = this.tileheight;

      map.tilecountwidth = this.tilecountwidth;
      map.tilecountheight = this.tilecountheight;
    },
    
    populateMapTemplates: function(map) {
      map.templates = this.templates;
    },
    
    populateMapTiles: function(map) {
      map.tiledata = new Array(this.tilecountwidth * this.tilecountheight);
      for(var i = 0; i < this.tiles.length; i++) {
        map.tiledata[i] = this.tiles[i].items;
      }      
    },
    
    populateMapCollision: function(map) {
      var field = new BitField(this.width * this.height);
      field.zero();
      
      for(var i = 0; i < this.tilecountwidth; i++) {
        for(var j = 0; j < this.tilecountheight; j++) {
          var index = this.index(i, j);
          var startx = i * this.tilewidth;
          var starty = j * this.tileheight;          
          var tile = map.tiledata[index];
          
          for(var x = 0 ; x < tile.length; x++) {
            var item = tile[x];
            var template = map.templates[item.template];
            var realx = item.x + startx + (template.size[0] / 2.0);
            var realy = item.y + starty + (template.size[1] / 2.0);
            var width = template.collision[0];
            var height = template.collision[1];
            
            realx += width / 2.0;
            realy += height / 2.0;
            
            realx = parseInt(realx);
            realy = parseInt(realy);
            
            for(var a = realx ; a < realx + width ; a++) {
              for(var b = realy ; b < realy + height; b++) {
                var index = a + b * this.width;
                field.set(index, 1);
              }
            }
          }          
        }
      };
      
      map.collision = field.values;     
    },
  
    addStatic: function(template, x, y) {
      var tile = this.tileAtCoords(x, y);
      var local = this.globalCoordsToTileCoords(x, y);

      if(!this.templates[template.id])
        this.addTemplate(template);
     
      tile.addItem(local.x, local.y, template.id);
      
      this.needsRedrawing = true;            
    },
    
    addTemplate: function(template) {
      this.templates[template.id] = template;
      this.createModelForTemplate(template);
    },
    globalCoordsToTileCoords: function(x, y) {
      return {
        x: x - (parseInt(x / this.tilewidth) * this.tilewidth),
        y: y - (parseInt(y / this.tileheight) * this.tileheight)
      };
    },
    removeStatic: function(tile, instance) {
      
    },
    getInstanceAt: function(x, y) {
      // Work out which tile this intersects
      
      // Adjust for the tile
      
      // Find an instance that intersects with that point
      
      // Return it
    }    
  };
  
  _.extend(MapBuilder.prototype, Map.prototype);
  
  return MapBuilder;

});
