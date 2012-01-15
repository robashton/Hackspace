define(function(require) {

  var Coords = require('../shared/coords');
  var InputTranslator = require('./inputtranslator');
  
  var InputEmitter = function(context) {
    var self = this;
    this.scene = context.scene;
    this.context = context;
    this.translator = new InputTranslator(context.element);
    
    this.translator.on('PrimaryAction', function(data) {
      self.onPrimaryAction(data);
    });
        this.translator.on('Hover', function(data) {
      self.onHover(data);
    });
  };
  
  InputEmitter.prototype = {
    onPrimaryAction: function(data) {
      var transformed = this.context.pageCoordsToWorldCoords(data.x, data.y);
      this.scene.broadcast('PrimaryAction', {
        x: transformed.x,
        y: transformed.y
      });

    },
    
    onHover: function(data) {
      var transformed = this.context.pageCoordsToWorldCoords(data.x, data.y);
      this.scene.broadcast('Hover', {
        x: transformed.x,
        y: transformed.y
      });    
    }
  };
  
  return InputEmitter;
  
  

});
