define(function(require) {
  var _ = require('underscore');

  var WorldItem = function(instance, data) {
    this.instance = instance;
    this.data = data;
  };
  
  WorldItem.prototype = {
    getEditorData: function() {
      return this.data;
    },
    select: function() {
      this.instance.drawFloor = true;
    },
    deselect: function() {
      this.instance.drawFloor = false;
    }
  };
  
  return WorldItem;
});
