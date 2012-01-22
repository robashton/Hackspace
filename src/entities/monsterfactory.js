define(function(require) {
  var _ = require('underscore');
  var Monster = require('./monster');
  
  var MonsterFactory = function() {
  
  };
  
  MonsterFactory.prototype = {
    create: function(id, data) {
      return new Monster(id, data);
    }
  };
  
  return MonsterFactory;
});
