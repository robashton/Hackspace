define(function(require) {
  var _ = require('underscore');
  var Entity = require('../scene/entity');
  var Item = require('../scripting/item');
  var Pickup = require('./pickup');

  var God = function(entityFactory, itemGeneration) {
    Entity.call(this, "god");
    this.entityFactory = entityFactory;
    this.itemGeneration = itemGeneration;
    this.scene = null;
    this.on('AddedToScene', this.onAddedToScene, this);
    
    var self = this;
    this.attach({
      createEntity: function(id, type, data) {
        var entity = self.entityFactory.createEntity(type, id, data);
        self.scene.add(entity);
      },
      destroyEntity: function(id) {
        var entity = self.scene.get(id);
        if(entity)
          self.scene.remove(entity);
      },
      createPickup: function(data) {
        var pickup = new Pickup(data.x, data.y, data.id, data.template);
        self.scene.add(pickup);
      }
    });
  };
  
  God.prototype = {
    onAddedToScene: function(scene) {
      this.scene = scene;
      this.scene.on('HealthZeroed', this.onEntityHealthZeroed, this);
    },
    onEntityHealthZeroed: function(data, sender) {
      this.generateItemForDeathOf(sender.id);
      this.scene.dispatch('god', 'destroyEntity', [ sender.id ]);
    },
    generateItemForDeathOf: function(targetId) {
      var self = this;
      var target = this.scene.withEntity(targetId, function(target){
        var targetPosition = target.get('Position');
        var item = self.itemGeneration.createItem();
        item.x = targetPosition[0];
        item.y = targetPosition[1];
        self.scene.dispatch('god', 'createPickup', [item]);
      });
    }
  };
  _.extend(God.prototype, Entity.prototype);
  
  return God;
});
