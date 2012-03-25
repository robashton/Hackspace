define(function(require) {
  var _ = require('underscore');
  var $ = require('jquery');
  var TileBuilder = require('./tilebuilder');
  var CONST = require('../static/consts');
  var Material = require('../render/material');
  var Quad = require('../render/quad');
  var DynamicTileSource = require('../static/dynamictilesource');

  var EditorTileSource = function(resources, scene, entityInstanceFactory) {
    DynamicTileSource.call(this, resources, scene);
    this.entityInstanceFactory = entityInstanceFactory;
  };

  EditorTileSource.prototype = {};

  _.extend(EditorTileSource.prototype, 
      DynamicTileSource.prototype, 
      {
        loadTile: function(i, j) {
          var self = this;
          this.withTileLoadingLock(i, j, function(cb) {
            $.getJSON('/services/gettile', {
              x: i,
              y: j
            }, function(data) {
              var tile = new TileBuilder(self, data, i * CONST.TILEWIDTH, j * CONST.TILEHEIGHT);
              tile.i = i;
              tile.j = j;
              var index = self.index(i, j);
              self.tiles[index] = tile;
              tile.createInstances();
              cb();
            });
          });
        }
      }
    );

  return EditorTileSource;
});