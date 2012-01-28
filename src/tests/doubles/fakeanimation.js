define(function(require) {
  var _ = require('underscore');

  var FakeAnimation = function() {
  
  };
  
  FakeAnimation.prototype = {
    frameCountForAnimation: function() {
      return 2; 
    }
  };
  
  return FakeAnimation;
});
