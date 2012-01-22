define(function(require) {
  var _ = require('underscore');
  var Character = require('./character');

  var CharacterFactory = function() {
    
  };
  
  CharacterFactory.prototype = {
    create: function(id, data) {
      return new Character(id, data);
    }
  };
  
  return CharacterFactory;
});
