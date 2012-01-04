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
      // Find the tile at those coords
      var tile = this.tileAtCoords(x, y);

      
      // Find the template for that id
      var model = this.modelForTemplate(template);
      
      // Add an instance at those coords
      var instance = new Instance(model);
      instance.scale(template.width, template.height);
      instance.translate(x, y);
      tile.push({
        x: x,  // wrong
        y: y, // wrong
        template: template.id,
        instance: instance
      });
      
      this.redrawBackground();
             
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
