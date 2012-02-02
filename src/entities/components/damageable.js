define(function(require) {
  var _ = require('underscore');

  var Damageable = function() {
    this.lastDamagerId = null;
    this.scene = null;
  };
  
  Damageable.prototype = {
    applyDamage: function(data) {
      // TODO: Do all the crazy calculations
      this.lastDamagerId = data.dealer;
      this.parent.dispatch('removeHealth', [ data.physical ]);
    },
    onAddedToScene: function(scene) {
      this.scene = scene;
    },
    onHealthZeroed: function() {
      if(this.lastDamagerId) {
        this.scene.dispatch(this.lastDamagerId, 'notifyKilledTarget', [this.parent.id]);
      }
    }
  };
  
  return Damageable;
});
