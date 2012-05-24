define(function(require) {
  var _ = require('underscore');
  var mat4 = require('glmatrix').mat4;

  var RenderGraph = function() {
    this.viewport = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    };
    this.items = [];
    this.updating = false;
    this.viewTransform = mat4.create();
    this.projTransform = mat4.create();
  };
  
  RenderGraph.prototype = {       
    width: function() {
      return this.viewport.right - this.viewport.left;
    },
    
    height: function() {
      return this.viewport.bottom - this.viewport.top;
    },
    
    beginUpdate: function() {
      this.updating = true;
    },
    
    endUpdate: function() {
      this.updating = false;
      this.sortItems();
    },
    
    sortItems: function() {
       this.items = _(this.items).sortBy(function(item) {
        return item.depth();
       })
    },
    
    updateViewport: function(left, right, top, bottom) {
      this.viewport = {
        left: left,
        right: right,
        top: top,
        bottom: bottom
      };

      var middlex = (this.viewport.right + this.viewport.left) / 2.0;
      var middley = (this.viewport.top + this.viewport.bottom) / 2.0;

      mat4.ortho(0, this.viewport.right - this.viewport.left, this.viewport.top - this.viewport.bottom, 0, -1, 1, this.projTransform);
      mat4.lookAt([middlex, middley, 0], [middlex, middley, -1], [0, 1, 0], this.viewTransform);
    },
    
    add: function(item) {
      this.items.push(item);
      if(!this.updating)
        this.sortItems();
    },
    
    remove: function(item) {
      this.items = _.without(this.items, [item]);
    },    
    
    clear: function() {
      this.items = [];
    },
        
    uploadTransforms: function(shader) {
      shader.uploadProjectionTransform(this.projTransform);
      shader.uploadViewTransform(this.viewTransform);
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
