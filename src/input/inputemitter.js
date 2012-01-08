define(function(require) {

  var Coords = require('../shared/coords');
  var InputTranslator = require('./inputtranslator');
  
  var InputEmitter = function(scene, canvasElement) {
    var self = this;
    this.scene = scene;
    this.canvasElement = canvasElement;
    this.translator = new InputTranslator(canvasElement);
    
    this.translator.on('PrimaryAction', function(data) {
      self.onPrimaryAction(data);
    });
  };
  
  InputEmitter.prototype = {
    onPrimaryAction: function(data) {
      var transformed = this.fromCanvasToWorld(data.x, data.y);
      this.scene.broadcast('PrimaryAction', {
        x: transformed.x,
        y: transformed.y
      });

    },
    
    fromCanvasToWorld: function(x, y) {
      var viewport = this.scene.graph.viewport;
      
      var canvasWidth = this.canvasElement.width;
      var canvasHeight = this.canvasElement.height;

           
      var scalex = canvasWidth / (viewport.right - viewport.left);
      var scaley = canvasHeight / (viewport.bottom - viewport.top);
     
      x /= scalex;
      y /= scaley;    
      
      x += (viewport.left);
      y += (viewport.top); 
            
      return  Coords.isometricToWorld(x,y);   
      
    }
  };
  
  return InputEmitter;
  
  

});
