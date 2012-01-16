define(function(require) {
  var _ = require('underscore');

  var StandardAnimations = function() {
    this.walking = false;
  };
  
  StandardAnimations.prototype = {
    onDestinationChanged: function() {
      if(!this.walking)
        this.startWalking();
    },
    onDestinationTargetChanged: function() {
      if(!this.walking)
        this.startWalking();
    },
    startWalking: function() {
      this.parent.dispatch('startAnimation', [ 'walking', 3 ]);
      this.walking = true;
    },
    onDestinationReached: function() {
      this.parent.dispatch('cancelAnimations', []);
      this.walking = false;
    }
  };
  
  return StandardAnimations;
});
