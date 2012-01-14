define(function(require) {
  var _ = require('underscore');

  var Death = function(scene) {
    this.scene = scene;
    this.scene.autoHook(this);
  };
  
  Death.prototype = {
    onDeath: function(data, sender) {
      this.scene.remove(sender);
    }
  };
  
  return Death;
});