define(function(require) {

  var CanvasRender = function(context) {
    this.context = context;
  };
  CanvasRender.prototype = {
    clear: function() {
      this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    },
    draw: function(graph) {
      var self = this;
      
      graph.uploadTransforms(this.context);
      
      graph.pass(function(item) {
        var model = item.model;
        
        model.upload(self.context);
        model.render(self.context, item);
      });
            
    }  
  };
  
  return CanvasRender;
});
