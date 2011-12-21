define(function(require) {

  var CanvasRender = function(canvas) {
    this.canvas = canvas;
  };
  CanvasRender.prototype = {
  
    draw: function(graph) {
      var self = this;
      
      graph.uploadTransforms(this.canvas);
      
      graph.pass(function(item) {
        var model = item.model;
        
        model.upload(self.canvas);
        model.render(self.canvas, item);
      });
            
    }  
  };
  
  return CanvasRender;
});
