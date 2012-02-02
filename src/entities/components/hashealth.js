define(function(require) {
  var _ = require('underscore');

  var HasHealth = function(amount) {
    this.amount = amount;
    this.totalAmount = amount;
    this.scene = null;
  };
  
  HasHealth.prototype = {
    onHealthLost: function(amount) {
      this.amount -= amount;
      if(this.amount <= 0)
        this.raiseDeath();
    },
    onAddedToScene: function(scene) {
      this.scene = scene;
    },    
    removeHealth: function(amount) {
      this.parent.raise('HealthLost', amount);
    },

    getMaxHealth: function() {
      return this.totalAmount;
    },
    getCurrentHealth:  function() {
      return this.amount;
    },
    raiseDeath: function() {
      this.parent.raise('HealthZeroed');
    },
    _out: function(data) {
      data.health = this.amount;
    },
    _in: function(data) {
      this.amount = data.health;
    }
  };
  
  return HasHealth;
});
