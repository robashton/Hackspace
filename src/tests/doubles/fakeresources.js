define(function(require) {
  var _ = require('underscore');
  var FakeTexture = require('./faketexture');
  var FakeAnimation = require('./fakeanimation');
  var FakeResources = function() {
    
  };
  
  FakeResources.prototype = {
    get: function(path) {
      if(path.indexOf('meta.json') > 0) {
        return new FakeAnimation();
      } else {
        return new FakeTexture();
      }
    }
  };
  
  return FakeResources;
});
