define(function(require) {

  var Trackable = function() {
    this.scene = null;
  };
  
  Trackable.prototype = {    
    updateCamera: function(data) {
      this.scene.camera.lookAt(data.x, data.y, data.z);
    },
    onPositionChanged: function(data) {
      if(this.scene)
        this.updateCamera(data);
    },
       
    onAddedToScene: function(scene) {
      this.scene = scene;
    }
  };  
  
  return Trackable;
  
});
