define(function(require) {
  var _ = require('underscore');
  var CharacterFactory = require('./characterfactory');
  var MonsterFactory = require('./monsterfactory');
  var NpcFactory = require('./npcfactory');

  var EntityFactory = function() {
    this.factories = {
      "character": new CharacterFactory(),
      "monster": new MonsterFactory(),
      "npc": new NpcFactory()
    };
  };
  
  EntityFactory.prototype = {
    create: function(type, id, data) {
      return this.factories[type].create(id, data);
    }
  };
  
  return EntityFactory;
});
