define(function(require) {
  var _ = require('underscore');

  var HasHealth = function(amount) {
    this.amount = amount;
    this.totalAmount = amount;
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
    getMaxHealth: function() {
      return this.totalAmount;
    },
    getCurrentHealth:  function() {
      return this.amount;
    },
    raiseDeath: function() {
      this.parent.raise('Death');
    }
  };
  
  return HasHealth;
});
