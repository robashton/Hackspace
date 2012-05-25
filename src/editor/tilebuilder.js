define(function(require) {
  var _ = require('underscore');
  var Tile = require('../static/tile');
  var WorldItem = require('./worlditem');
  var BitField = require('../shared/bitfield');
  var CONST = require('../static/consts')

  var TileBuilder = function(parent, data, x, y) {
    Tile.call(this, parent, data.items, data.collision, x, y);
    this.parent = parent;
    this.entities = {};
    this.addEntitiesFromData(data.entities || {});
  };

  TileBuilder.prototype = {
    addEntitiesFromData: function(entities) {
      for(var i in entities) {
        var entity = entities[i];
        this.entities[i] = new WorldItem(this.parent, i, entity);
        this.entities[i].createInstance();
      }
    },
    addEntity: function(id, type, data) {
      this.entities[id] = new WorldItem(this.parent, id, {
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
    itemAt: function(x, y) {
      for(var i in this.entities) {
        var item = this.entities[i];
        if(!item.intersectWithWorldCoords(x, y)) continue;
        return item;
      }
    },
    getData: function() {
      var data = {};
      this.populateEntities(data);
      this.populateItems(data);
      this.populateCollision(data);
      return data;
    },
    
    populateEntities: function(data) {
      data.entities = {};
      for(var i in this.entities) {
        var item = this.entities[i];
        data.entities[i] = item.entity;  
      }
    },    
 
    populateItems: function(data) {
      data.items = this.items;
    },

    populateCollision: function(data) {
      var field = new BitField(CONST.TILEWIDTH * CONST.TILEHEIGHT);
      field.zero();
      
      for(var x = 0 ; x < this.items.length; x++) {
        var item = this.items[x];
        var template = this.parent.templates[item.template];

        var realx = (item.x - this.x);
        var realy = (item.y - this.y);
        var width = template.collision[0];
        var height = template.collision[1];
                
        realx = parseInt(realx);
        realy = parseInt(realy);
        
        for(var a = realx ; a < realx + width ; a++) {
          for(var b = realy ; b < realy + height; b++) {
            var index = a + b * CONST.TILEWIDTH;
            field.set(index, 1);
          }
        }   
      }; 
      data.collision = field.values;     
    }
  };
  _.extend(TileBuilder.prototype, Tile.prototype);

  return TileBuilder;
});