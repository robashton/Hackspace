define(function(require) {
  var _ = require('underscore');

  var RenderGraph = function() {
    this.viewport = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    };
  };
  
  RenderGraph.prototype = {
    items: [],
       
    width: function() {
      return this.viewport.right - this.viewport.left;
    },
    
    height: function() {
      return this.viewport.bottom - this.viewport.top;
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
    
    clear: function() {
      this.items = [];
    },
        
    uploadTransforms: function(context) {
      this.applyScale(context);
      this.applyTranslate(context);
    },
    
    applyTranslate: function(context) {
      context.translate(-this.viewport.left, - this.viewport.top);
    },
    
    applyScale: function(context) {
      var canvas = context.canvas;
      var canvasWidth = canvas.width;
      var canvasHeight = canvas.height;
      
      var scale = this.getScaleForDimensions(canvasWidth, canvasHeight);
      
      context.scale(scale.x, scale.y);
    },
    
    getScaleForDimensions: function(width, height) {
      return {
        x: width / (this.viewport.right - this.viewport.left),
        y: height / (this.viewport.bottom - this.viewport.top)
      };
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
