define(function(require) {
  var _ = require('underscore');

  var RenderGraph = function() {};
  
  RenderGraph.prototype = {
    items: [],
    
    viewport: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    
    updateViewport: function(left, right, top, bottom) {
      this.viewport = {
        left: left,
        right: right,
        top: top,
        bottom: bottom
      };
    },
    
    add: function(item) {
      this.items.push(item);
    },
    
    remove: function(item) {
      this.items = _.without(this.items, [item]);
    },    
        
    uploadTransforms: function(canvas) {
    
    },
    
    pass: function(callback) {
      var self = this;
      _(this.items).chain()
       .filter(function(item) { return item.visible(self.viewport); })
       .each(callback);
    },
  };
  
  return RenderGraph;
});
