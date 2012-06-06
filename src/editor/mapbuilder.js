define(function(require) {
  
  var _ = require('underscore');
  var Map = require('../static/map');
  var Instance = require('../render/instance');
  var BitField = require('../shared/bitfield');
  var WorldItem = require('./worlditem');
  var EditorTileSource = require('./editortilesource');
  var CONST = require('../static/consts');

  var MapBuilder = function(data, tileSource, renderSettings) {
    Map.call(this, tileSource, renderSettings);
  };
  
  MapBuilder.prototype = {
    
    withWorldItemAt: function(x, y, cb) {
      this.tiles.withTileAtCoords(x, y, function(tile) {
        var item = tile.itemAt(x, y);
        if(item) { cb(item); }
      });    
    },

    eachLoadedTile: function(cb) {
      this.tiles.eachTile(cb);
    },
  
    addStatic: function(template, x, y) {
      this.tiles.withTileAtCoords(x, y, function(tile) {
        tile.addStatic(x, y, template.id);
      });
      this.populateGraph();
    },

    addEntity: function(id, type, data) {
      this.tiles.withTileAtCoords(data.x, data.y, function(tile) {
        tile.addEntity(id, type, data);
      });
      this.populateGraph();
    },

    globalCoordsToTileCoords: function(x, y) {
      return {
        x: x - (parseInt(x / CONST.TILEWIDTH) * CONST.TILEWIDTH),
        y: y - (parseInt(y / CONST.TILEHEIGHT) * CONST.TILEHEIGHT)
      };
    }
  };
  
  _.extend(MapBuilder.prototype, Map.prototype);
  
  return MapBuilder;

});
