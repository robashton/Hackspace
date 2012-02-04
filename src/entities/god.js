define(function(require) {
  var _ = require('underscore');
  var Entity = require('../scene/entity');

  var God = function(entityFactory) {
    Entity.call(this, "god");
    this.entityFactory = entityFactory;
    this.scene = null;
    this.on('AddedToScene', this.onAddedToScene, this);
    
    var self = this;
    this.attach({
      createEntity: function(id, type, data) {
        var entity = self.entityFactory.create(type, id, data);
        self.scene.add(entity);
      },
      destroyEntity: function(id) {
        var entity = self.scene.get(id);
        if(entity)
          self.scene.remove(entity);
      }
    });
  };
  
  God.prototype = {
    onAddedToScene: function(scene) {
      this.scene = scene;
      this.scene.on('HealthZeroed', this.onEntityHealthZeroed, this);
    },
    onEntityHealthZeroed: function(data, sender) {
      this.scene.dispatch('god', 'destroyEntity', [ sender.id ]);
    }
  };
  _.extend(God.prototype, Entity.prototype);
  
  return God;
});
