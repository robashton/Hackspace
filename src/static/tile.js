define(function(require) {

  var _ = require('underscore');
  var Instance = require('../render/instance');
  var Eventable = require('../shared/eventable');
  var Coords = require('../shared/coords');
  var CONST = require('./consts');
  var CollisionMap = require('./collisionmap');

  var Tile = function(map, items, collision, x, y) {
    Eventable.call(this);    
    this.map = map;
    this.items = items;
    this.collision = new CollisionMap(collision, CONST.TILEWIDTH, CONST.TILEHEIGHT);
    this.instances = [];
    this.floorInstance = null;
    this.x = x;
    this.y = y;
  };
  
  Tile.prototype = {
    addInstancesToGraph: function(graph) {
      graph.add(this.floorInstance);
      for(var i in this.instances) {
        var instance = this.instances[i];
        graph.add(instance);
      }
    },
    createInstances: function() {    
      for(var i = 0; i < this.items.length ; i++) {
        this.createInstanceForItem(i);
      }
      this.createFloor();
    },
    createFloor: function() {
      var transformedCoords = Coords.worldToIsometric(this.x, this.y);
      transformedCoords.y += CONST.RENDERTILEHEIGHT / 2.0;
      
      var floorCoords = Coords.isometricToWorld(transformedCoords.x, transformedCoords.y);
      
      this.floorInstance = new Instance(this.map.models['testtile']);
      this.floorInstance.scale(CONST.RENDERTILEWIDTH, 0, CONST.RENDERTILEHEIGHT);
      this.floorInstance.translate(floorCoords.x , floorCoords.y + CONST.RENDERTILEHEIGHT , 0);
      this.floorInstance.forceDepth(-10000 + this.floorInstance.depth());
    },
    createInstanceForItem: function(i) {
      var item = this.items[i];        
      var model = this.map.models[item.template];
      var template = this.map.templates[item.template];
      var instance = new Instance(model);
      instance.scale(template.size[0], template.size[1], template.size[2]);
      instance.translate(item.x, item.y);
      this.instances[i] = instance;
    },
    forEachInstance: function(callback, context) {
      for(var i = 0; i < this.instances.length; i++) {
        callback.call(context, this.instances[i], this.map.templates[this.items[i].template]);
      }
    },
    solidAt: function(x, y) {
      var localx = parseInt(x - this.x);
      var localy = parseInt(y - this.y);
      return this.collision.solidAt(localx, localy);
    }
  };
  _.extend(Tile.prototype, Eventable.prototype);
  return Tile;  
});
