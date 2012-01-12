define(function(require) {
  var _ = require('underscore');

  var Automatable = function() {
    
  };
  
  Automatable.prototype = {
    onAddedToScene: function() {
      this.parent.raise('StateChanged', 'Wandering');
    },
    onDestinationTargetChanged: function() {
      this.parent.raise('StateChanged', 'Seeking');
    },
    onDestinationReached: function() {
      
    },
  };
  
  return Automatable;
});
