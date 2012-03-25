define(function(require) {
  var _ = require('underscore');
  var Coords = require('../shared/coords');
  var Eventable = require('../shared/eventable');

  var Material = require('../render/material');
  var Quad = require('../render/quad');
  var Instance = require('../render/instance');
  var Entity = require('../scene/entity');
  var Tile = require('./tile');
  var CollisionMap = require('./collisionmap');
  var CONST = require('./consts');

  var StaticTileSource = function(data, resources) {
    Eventable.call(this);
    this.width = data.width;
    this.height = data.height;

    this.templates = data.templates;
    this.tiledata = data.tiledata;
    this.tilecountwidth = data.tilecountwidth;
    this.tilecountheight = data.tilecountheight;
    this.tiles = {};
    this.resources = resources;

    this.collision = new CollisionMap(data);
    this.models = {};
    this.createModels();
    this.createInstances();
  };

  StaticTileSource.prototype = {
    withTile: function(i, j, cb) {
      var index =  this.index(i, j);
      var tile = this.tiles[index];
      if(tile)
        cb(tile);
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
 
    createInstances: function() {    
      for(var x = 0; x < this.tilecountwidth; x++) {
        for(var y = 0; y < this.tilecountheight ; y++) {
          var index = this.index(x, y);
          var tile =  new Tile(this, this.tiledata[index], x * CONST.TILEWIDTH, y * CONST.TILEHEIGHT);
          this.tiles[index] = tile;
          tile.createInstances();
        }
      }
    },

    index: function(x, y) {
      return x + y * this.tilecountwidth;
    },
    
    solidAt: function(x, y) {
      return this.collision.solidAt(parseInt(x), parseInt(y));
    }
  };

  _.extend(StaticTileSource.prototype, Eventable.prototype);

  return StaticTileSource;
});   