define(function(require) {
  
  var _ = require('underscore');
  var Map = require('../static/map');
  var Instance = require('../render/instance');
  var BitField = require('../shared/bitfield');
  var WorldItem = require('./worlditem');
  var EditorTileSource = require('./editortilesource');
  var CONST = require('../static/consts');

  var MapBuilder = function(data, tileSource) {
    Map.call(this, tileSource);
  };
  
  MapBuilder.prototype = {
    
    getWorldItemAt: function(x, y) {

      // TODO: Make this async
      return null;
      /*
      // Check dynamic instances first
      for(var i in this.entities) {
        var item = this.entities[i];
        if(!item.intersectWithWorldCoords(x, y)) continue;
        return item;
      }
      */
      // Then check static
      return null; // Not now ;-)      
    },
  
    getMapData: function() {
      var map = {};  
     /* this.populateMapTemplates(map);
      this.populateMapTiles(map);
      this.populateMapCollision(map);
      this.populateEntities(map);
      return map; */
    },
  
    addStatic: function(template, x, y) {
      this.withTileAtCoords(x, y, function(tile) {
        tile.addStatic(x, y, template.id);
      });
      this.needsRedrawing = true;            
    },

    addEntity: function(id, type, data) {
      this.withTileAtCoords(data.x, data.y, function(tile) {
        tile.addEntity(id, type, data);
      });
      this.needsRedrawing = true;
    },

    globalCoordsToTileCoords: function(x, y) {
      return {
        x: x - (parseInt(x / CONST.TILEWIDTH) * CONST.TILEWIDTH),
        y: y - (parseInt(y / CONST.TILEHEIGHT) * CONST.TILEHEIGHT)
      };
    },
    withTileAtCoords: function(x, y, cb) {
      var tileX = parseInt(x / CONST.TILEWIDTH);
      var tileY = parseInt(y / CONST.TILEHEIGHT);
      this.tiles.withTile(tileX, tileY, cb);
    }
  };
  
  _.extend(MapBuilder.prototype, Map.prototype);
  
  return MapBuilder;

});
