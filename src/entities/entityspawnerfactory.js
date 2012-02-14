define(function(require) {
  var _ = require('underscore');
  var EntitySpawner = require('./entityspawner');
  
  var EntitySpawnerFactory = function() {
  
  };
  
  EntitySpawnerFactory.prototype = {
    create: function(id, data) {
      return new EntitySpawner(id, data);
    }
  };
  
  return EntitySpawnerFactory;
});
