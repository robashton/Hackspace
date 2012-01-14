define(function(require) {
  var _ = require('underscore');

  var Damageable = function() {
    this.lastDamagerId = null;
    this.scene = null;
  };
  
  Damageable.prototype = {
    applyDamage: function(data) {
      // Do all the crazy calculations
      this.lastDamagerId = data.dealer;
      this.parent.dispatch('removeHealth', [ data.physical ]);
    },
    onAddedToScene: function(scene) {
      this.scene = scene;
    },
    onDeath: function() {
      var self = this;
      if(this.lastDamagerId) {
        this.scene.withEntity(this.lastDamagerId, function(damager) {
          damager.dispatch('notifyKilledTarget', [self.parent.id]);
        });
      }
    }
  };
  
  return Damageable;
});
