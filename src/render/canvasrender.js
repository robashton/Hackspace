define(function(require) {
  var Shader = require('./shader');

  var CanvasRender = function(context, defaultShader) {
    this.context = context;
    this.context.clearColor(0.0, 0.0, 0.0, 1.0);
    this.defaultShader = defaultShader;
  };
  CanvasRender.prototype = {
    clear: function() {
      this.context.viewport(0, 0, this.context.width, this.context.height);
      this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
    },
    draw: function(graph) {
      var self = this;

      this.defaultShader.activate();
      graph.uploadTransforms(this.defaultShader);
      
/*
      graph.pass(function(item) {
        item.render(self.context);
      });
  */   
    }  
  };
  
  return CanvasRender;
});
