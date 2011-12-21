define(function(require) {

  var Scenery = function() {
    this.x = 0;
    this.y = 0;
    this.tiles = {};
  };
  Scenery.prototype = {
    tick: function() {
      //
      
    },
    setScene: function(scene) {
      this.scene = scene;
    },
    loadTiles: function() {
    
    }
  };
  
  return Scenery;
});
