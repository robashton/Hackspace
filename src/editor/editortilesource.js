define(function(require) {
  var _ = require('underscore');
  var $ = require('jquery');
  var Tile = require('../static/tile');
  var CONST = require('../static/consts');

  var EditorTileSource = function() {
    this.tiles = {};
    this.loadingTiles = {};
  };

  EditorTileSource.prototype = {
    withTile: function(i, j, cb) {
      var index = this.index(i,j);
      var tile = this.tiles[index];
      if(!tile) this.loadTile(i, j);
      else cb(tile);
    },
    index: function(i, j) {
      var xstr = i.toString(10);
      var ystr = i.toString(10);
      return xstr + ystr;
    },
    loadTile: function(i, j) {
      var self = this;
      this.withTileLoadingLock(i, j, function(cb) {
        $.getJSON('/services/gettile', {
          x: i,
          y: j
        }, function(data) {
          var tile = new Tile(self, data, i * CONST.TILEWIDTH, j * CONST.TILEHEIGHT);
          var index = self.index(i, j);
          self.tiles[index] = tile;
          tile.createInstances();
          cb();
        });
      });
    },
    withTileLoadingLock: function(i, j, cb) {
      var index = this.index(i, j);
      if(this.loadingTiles[index]) return;
      this.loadingTiles[index] = {};
      var self = this;
      cb(function() {
        delete self.loadingTiles[index];
      })
    }
  };

  return EditorTileSource;
});