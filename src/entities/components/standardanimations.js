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
    onPunchedTarget: function() {
      this.parent.dispatch('playAnimation', [ 'punching', 5 ]);
    },
    startWalking: function() {
      this.parent.dispatch('startAnimation', [ 'walking', 5 ]);
      this.walking = true;
    },
    onDestinationReached: function() {
      this.parent.dispatch('cancelAnimations', []);
      this.walking = false;
    }
  };
  
  return StandardAnimations;
});
