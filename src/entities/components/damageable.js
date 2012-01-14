define(function(require) {
  var _ = require('underscore');

  var Damageable = function() {
  
  };
  
  Damageable.prototype = {
    applyDamage: function(data) {
      // Do all the crazy calculations
      this.parent.dispatch('removeHealth', [ data.physical ]);
    }
  };
  
  return Damageable;
});
