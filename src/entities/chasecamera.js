define(function(require) {
  var _ = require('underscore');

  var ChaseCamera = function(scene, targetId) {
    this.scene = scene;
    this.targetId = targetId;
    this.scene.on('PreRender', this.onScenePreRender, this);
  };
  
  ChaseCamera.prototype = {
    onScenePreRender: function() {
      var self = this;
      this.scene.withEntity(this.targetId, function(target) {
        var position = target.get('Position');
        self.scene.camera.lookAt(position[0], position[1], position[2]);
      });

    }
  };
  
  return ChaseCamera;
});
