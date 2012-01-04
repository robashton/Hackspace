define(function(require) {
  
  var _ = require('underscore');
  var Map = require('../static/map');
  var Instance = require('../render/instance');

  var MapBuilder = function(width, height, tilewidth, tileheight) {
    Map.call(this, width, height, tilewidth, tileheight);
  };
  
  MapBuilder.prototype = {
  
    getMapData: function() {
      var map = {};  
      this.populateMapMetadata(map);
      this.populateMapTemplates(map);
      this.populateMapTiles(map);
      return map;
    },
    
    populateMapMetadata: function(map) {
      map.width = this.width;
      map.height = this.height;
      map.tilewidth = this.tilewidth;
      map.tileheight = this.tileheight;
    },
    
    populateMapTemplates: function(map) {
      map.templates = null;
    },
    
    populateMapTiles: function(map) {
      
    },
  
    addStatic: function(template, x, y) {
      var tile = this.tileAtCoords(x, y);
      var local = this.globalCoordsToTileCoords(x, y);
      
      console.log(local);
      
      if(!this.templates[template.id])
        this.addTemplate(template);
     
      tile.addItem(local.x, local.y, template.id);
      
      this.redrawBackground();             
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
