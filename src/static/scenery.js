define(function(require) {

  var Scenery = function() {
    Entity.call(this, "scenery");
    this.scene = null;
    
    this.on('AddedToScene', this.onAddedToScene);
    this.on('Tick', this.onTick);
  };
  
  Scenery.prototype = {
    onAddedToScene: function(scene) {
      this.scene = scene;    
    },
    onTick: function() {
      
      // Look at the current viewport
      
      // Compare it to what we currently have drawn
      
      // Determine if we need to re-draw and update the renderable
      
    }
  };
  
  _.extend(Scenery.prototype, Entity.prototype);
  
  return Scenery;

});
