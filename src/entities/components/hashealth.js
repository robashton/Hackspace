define(function(require) {
  var _ = require('underscore');

  var HasHealth = function(amount) {
    this.amount = amount;
  };
  
  HasHealth.prototype = {
    removeHealth: function(amount) {
      this.parent.raise('HealthLost', amount);
    },
    onHealthLost: function(amount) {
      this.amount -= amount;
      if(this.amount <= 0)
        this.raiseDeath();
    },
    raiseDeath: function() {
      this.parent.raise('Death');
    }
  };
  
  return HasHealth;
});
