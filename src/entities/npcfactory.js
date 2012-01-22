define(function(require) {
  var _ = require('underscore');
  var Npc = require('./npc');
  
  var NpcFactory = function() {
    
  };
  
  NpcFactory.prototype = {
    create: function(id, data) {
      return new Npc(id, data);
    }
  };
  
  return NpcFactory;
});
