define(function(require) {
  var _ = require('underscore');
  var $ = require('jquery');

  var CONST = require('./consts');
  var Material = require('../render/material');
  var Quad = require('../render/quad');

  var DynamicTileSource = function(resources, scene) {
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
      this.templates = this.resources.get('/main/templates.json').get();
    },
    createModels: function() {
      for(var t in this.templates) {
        var template = this.templates[t];
        this.createModelForTemplate(template);  
      }
      this.createModelForTemplate({
        id: 'testtile',
        texture: '/main/testtile.png'
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

  return DynamicTileSource;
});