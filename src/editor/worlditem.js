define(function(require) {
  var _ = require('underscore');

  var WorldItem = function(tool, id, entity) {
    this.instance = null;
    this.tool = tool;
    this.id = id;
    this.entity = entity;
  };
  
  WorldItem.prototype = {
    getEditorData: function() {
      return this.entity.data;
    },
    updateData: function(data) {
      this.entity.data = data;
      this.destroyInstance();
      this.createInstance();
    },
    select: function() {
      this.instance.drawFloor = true;
    },
    deselect: function() {
      this.instance.drawFloor = false;
    },
    createInstance: function() {
      this.instance = this.tool.entityInstanceFactory.createInstanceForEntityType(this.entity.type);
      this.instance.translate(this.entity.data.x, this.entity.data.y);
      this.tool.scene.graph.add(this.instance);
    },
    destroyInstance: function() {
      this.tool.scene.graph.remove(this.instance);
      this.instance = null;
    },
    intersectWithWorldCoords: function(x, y) {
      return this.instance.intersectWithWorldCoords(x, y);
    }
  };
  
  return WorldItem;
});
