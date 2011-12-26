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
        
    uploadTransforms: function(context) {
      this.applyScale(context);
      this.applyTranslate(context);

    },
    
    applyTranslate: function(context) {
      context.translate(-this.viewport.left, -this.viewport.top);
    },
    
    applyScale: function(context) {
      var canvas = context.canvas;
      var canvasWidth = canvas.width;
      var canvasHeight = canvas.height;
      
      var scalex = canvasWidth / (this.viewport.right - this.viewport.left);
      var scaley = canvasHeight / (this.viewport.bottom - this.viewport.top);
      
      context.scale(scalex, scaley);
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
