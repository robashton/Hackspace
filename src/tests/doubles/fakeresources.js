define(function(require) {
  var _ = require('underscore');
  var FakeTexture = require('./faketexture');

  var FakeResources = function() {
    
  };
  
  FakeResources.prototype = {
    get: function() {
      return new FakeTexture();
    }
  };
  
  return FakeResources;
});
