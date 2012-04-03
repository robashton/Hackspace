define(function(require) {
  var _ = require('underscore');

  var DeathWatcher = function(scene, itemGeneration) {
    this.itemGeneration = itemGeneration;
    this.scene = scene;
    this.hookSceneEvents();
  };

  DeathWatcher.prototype = {
    hookSceneEvents: function() {
      this.scene.on('KilledTarget', this.onKilledTarget, this);
    },
    onKilledTarget: function(targetId, sender) {
      var item = itemGeneration.createItem();
      var target = this.scene.withEntity(targetId, function(target){
        var targetPosition = target.get('Position');
        this.scene.dispatch('god', 'createPickup', itemGeneration);
      });
      
    }
  };

  return DeathWatcher;
});