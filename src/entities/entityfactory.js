define(function(require) {
  var _ = require('underscore');
  var CharacterFactory = require('./characterfactory');
  var MonsterFactory = require('./monsterfactory');
  var NpcFactory = require('./npcfactory');
  var Eventable = require('../shared/eventable');

  var EntityFactory = function() {
    Eventable.call(this);
    this.factories = {
      "character": new CharacterFactory(),
      "monster": new MonsterFactory(),
      "npc": new NpcFactory()
    };
  };
  
  EntityFactory.prototype = {
    create: function(type, id, data) {
      var entity =  this.factories[type].create(id, data);
      this.raise('EntityCreated', {
        data: data,
        id: id,
        entity: entity,
        type: type
      });
      return entity;
    }
  };
  
  _.extend(EntityFactory.prototype, Eventable.prototype);
  
  return EntityFactory;
});
