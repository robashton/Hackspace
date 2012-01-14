define(function(require) {
  var _ = require('underscore');

  var Damageable = function() {
  
  };
  
  Damageable.prototype = {
    applyDamage: function(data) {
      console.log(data.physical);
    }
  };
  
  return Damageable;
});
