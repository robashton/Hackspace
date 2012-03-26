define(function(require) {
  var _ = require('underscore');
  var $ = require('jquery');

  var CONST = require('./consts');
  var Material = require('../render/material');
  var Quad = require('../render/quad');
  var Tile = require('./tile');
  var Eventable = require('../shared/eventable');

  var DynamicTileSource = function(resources, scene) {
    Eventable.call(this);

    this.tiles = {};
    this.loadingTiles = {};
    this.resources = resources;
    this.scene = scene;
    this.templates = null;
    this.models = {};
    this.createTemplates();
    this.createModels();
  };

  DynamicTileSource.prototype = {
    createTemplates: function() {
      this.templates = this.resources.get('main/templates.json').get();
    },
    createModels: function() {
      for(var t in this.templates) {
        var template = this.templates[t];
        this.createModelForTemplate(template);  
      }
      this.createModelForTemplate({
        id: 'testtile',
        texture: 'main/testtile.png'
      });
    },
    createModelForTemplate: function(template) {
      var material = new Material();
      material.diffuseTexture = this.resources.get(template.texture);
      this.models[template.id] = new Quad(material);
      return this.models[template.id];
    },
    withTile: function(i, j, cb) {
      var index = this.index(i,j);
      var tile = this.tiles[index];
      if(!tile) this.loadTile(i, j);
      else cb(tile);
    },
    index: function(i, j) {
      var xstr = i.toString(10);
      var ystr = j.toString(10);
      return xstr + ystr;
    },
    eachTile: function(cb) {
      for(var index in this.tiles) {
        var tile = this.tiles[index];
        cb(tile.i, tile.j, tile);
      }
    },
    loadTile: function(i, j) {
      var self = this;
      this.withTileLoadingLock(i, j, function(cb) {
        $.getJSON('/services/gettile', {
          x: i,
          y: j
        }, function(data) {
          var tile = new Tile(this, data.items, data.collision, i * CONST.TILEWIDTH, j * CONST.TILEHEIGHT);
          var index = this.index(i, j);
          this.tiles[index] = tile;
          tile.createInstances();
          tile.on('InstanceOpacityChanged', this.onInstanceOpacityChanged, this);
          cb();
          this.raise('TileLoaded', tile);
        }.bind(self));
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
    },
    solidAt: function(x, y) {
      var tileX = parseInt(x / CONST.TILEWIDTH);
      var tileY = parseInt(y / CONST.TILEHEIGHT);
      var index = this.index(tileX, tileY);
      var tile = this.tiles[index];
      if(!tile) return false;
      return tile.solidAt(x, y);
    },
    withTileAtCoords: function(x, y, cb) {
      var tileX = parseInt(x / CONST.TILEWIDTH);
      var tileY = parseInt(y / CONST.TILEHEIGHT);
      this.withTile(tileX, tileY, cb);
    },
    onInstanceOpacityChanged: function(instance) {
      this.raise('InstanceOpacityChanged', instance)
    }
  };

  _.extend(DynamicTileSource.prototype, Eventable.prototype);

  return DynamicTileSource;
});