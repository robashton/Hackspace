define(function(require) {

  var CanvasRender = function(context) {
    this.context = context;
    this.context.clearColor(0.0, 0.0, 0.0, 1.0);
  };
  CanvasRender.prototype = {
    clear: function() {
      this.context.viewport(0, 0, this.context.width, this.context.height);
      this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
    },
    draw: function(graph) {
      var self = this;
      
      graph.uploadTransforms(this.context);
      
      // Upload the buffers cap'n

/*
      graph.pass(function(item) {
        item.render(self.context);
      });
  */   
    }  
  };
  
  return CanvasRender;
});
