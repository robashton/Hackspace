define(function(require) {
  var Map = require('./map');
  var Instance = require('../render/instance');

  var MapBuilder = function(width, height, tilewidth, tileheight) {
    Map.call(this, width, height, tilewidth, tileheight);
  };
  
  MapBuilder.prototype = {
    addInstance: function(model, x, y) {
      
    },
    deleteInstance: function(tile, instance) {
      
    },
    getInstanceAt: function(x, y) {
      // Work out which tile this intersects
      
      // Adjust for the tile
      
      // Find an instance that intersects with that point
      
      // Return it
    }    
  };
  
  _.extend(Map.prototype, MapBuilder.prototype);
  
  

});
