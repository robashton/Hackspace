define(function(require) {
  var _ = require('underscore');
  var Tile = require('../static/tile');
  var WorldItem = require('./worlditem');

  var TileBuilder = function(map, data, x, y) {
    Tile.call(this, map, data.items, x, y);
    this.builder = map;
    this.collision = data.collision;
    this.entities = {};
    this.addEntitiesFromData(data.entities || {});
  };

  TileBuilder.prototype = {
    addEntitiesFromData: function(entities) {
      for(var i in entities) {
        var entity = entities[i];
        this.entities[i] = new WorldItem(this.builder, i, entity);
      }
    },
    addEntity: function(id, type, data) {
      this.entities[id] = new WorldItem(this.builder, id, {
        type: type,
        data: data
      });
      this.entities[id].createInstance();
    },
    addStatic: function(x, y, template) {
      var i = this.items.length;
      this.items.push({
        x: x,
        y: y,
        template: template
      });
      this.createInstanceForItem(i);      
    },
    getData: function() {

    },
    /*
    populateEntities: function(map) {
      map.entities = {};
      for(var i in this.entities) {
        var item = this.entities[i];
        map.entities[i] = item.entity;  
      }
    },    
    
    populateMapTemplates: function(map) {
      map.templates = this.templates;
    },
    
    populateMapTiles: function(map) {
      map.tiledata = new Array(this.tilecountwidth * this.tilecountheight);
      for(var i = 0; i < this.tiles.length; i++) {
        map.tiledata[i] = this.tiles[i].items;
      }
    },
    
    populateMapCollision: function(map) {
      var field = new BitField(this.width * this.height);
      field.zero();
      
      for(var i = 0; i < this.tilecountwidth; i++) {
        for(var j = 0; j < this.tilecountheight; j++) {
          var index = this.index(i, j);
          var startx = i * CONST.TILEWIDTH;
          var starty = j * CONST.TILEHEIGHT;          
          var tile = map.tiledata[index];
          
          for(var x = 0 ; x < tile.length; x++) {
            var item = tile[x];
            var template = map.templates[item.template];
            var realx = item.x + startx + (template.size[0] / 2.0);
            var realy = item.y + starty + (template.size[1] / 2.0);
            var width = template.collision[0];
            var height = template.collision[1];
            
            realx += width / 2.0;
            realy += height / 2.0;
            
            realx = parseInt(realx);
            realy = parseInt(realy);
            
            for(var a = realx ; a < realx + width ; a++) {
              for(var b = realy ; b < realy + height; b++) {
                var index = a + b * this.width;
                field.set(index, 1);
              }
            }
          }          
        }
      };
      
      map.collision = field.values;     
    }*/
  };
  _.extend(TileBuilder.prototype, Tile.prototype);

  return TileBuilder;
});