define(function(require) {

  var _ = require('underscore');
  var Instance = require('../render/instance');
  var Eventable = require('../shared/eventable');
  var Coords = require('../shared/coords');
  
  var Tile = function(map, items, x, y) {
    Eventable.call(this);
    
    this.map = map;
    this.items = items;
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
        if(instance.opacity < 1.0) continue;
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
      transformedCoords.y += this.map.renderTileHeight / 2.0;
      
      var floorCoords = Coords.isometricToWorld(transformedCoords.x, transformedCoords.y);
      
      this.floorInstance = new Instance(this.map.models['testtile']);
      this.floorInstance.scale(this.map.renderTileWidth, 0, this.map.renderTileHeight);
      this.floorInstance.translate(floorCoords.x , floorCoords.y + this.map.renderTileHeight , 0);
      this.floorInstance.forceDepth(-10000 + this.floorInstance.depth());
    },
    createInstanceForItem: function(i) {
      var item = this.items[i];        
      var model = this.map.models[item.template];
      var template = this.map.templates[item.template];
      var instance = new Instance(model);
      instance.scale(template.size[0], template.size[1], template.size[2]);
      instance.translate(this.x + item.x, this.y + item.y);
      this.instances[i] = instance;
      instance.on('OpacityChanged', this.onInstanceOpacityChanged, this);
    },
    onInstanceOpacityChanged: function(data, sender) {
      this.raise('InstanceOpacityChanged', sender);
    },
    addItem: function(x, y, template) {
      var i = this.items.length;
      this.items.push({
        x: x,
        y: y,
        template: template
      });
      this.createInstanceForItem(i);      
    },
    forEachInstance: function(callback, context) {
      for(var i = 0; i < this.instances.length; i++) {
        callback.call(context, this.instances[i]);
      }
    },
  };
  _.extend(Tile.prototype, Eventable.prototype);
  return Tile;  
});
