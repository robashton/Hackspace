define(function(require) {

  var Instance = require('../render/instance');
  
  var Tile = function(map, items, x, y) {
    this.map = map;
    this.items = items;
    this.instances = [];
    this.x = x;
    this.y = y;
  };
  
  Tile.prototype = {
    addInstancesToGraph: function(graph) {
      for(var i in this.instances) {
        graph.add(this.instances[i]);
      }
    },
    createInstances: function() {    
      for(var i = 0; i < this.items.length ; i++) {
        this.createInstanceForItem(i);
      }
    },
    createInstanceForItem: function(i) {
      var item = this.items[i];        
      var model = this.map.models[item.template];
      var template = this.map.templates[item.template];
      var instance = new Instance(model);
      instance.scale(template.size[0], template.size[1], template.size[2]);
      instance.translate(this.x + item.x, this.y + item.y);
      this.instances[i] = instance;
    },
    addItem: function(x, y, template) {
      var i = this.items.length;
      this.items.push({
        x: x,
        y: y,
        template: template
      });
      this.createInstanceForItem(i);      
    }
  };
  
  return Tile;  
});
