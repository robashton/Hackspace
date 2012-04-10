define(function(require) {

  var Coords = require('../shared/coords');
  var InputTranslator = require('./inputtranslator');
  
  var InputEmitter = function(translator, context) {
    var self = this;
    this.scene = context.scene;
    this.context = context;
    this.translator = translator;
    this.translator.autoHook(this);
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
    },

    onZoom: function(zoom) {
      // this.scene.camera.distance = 150.0 + (50.0 * zoom); 
      // Not unless I do re-sizing of the terrain without re-drawing it
    }
  };
  
  return InputEmitter;
  
  

});
