define(function(require) {

  var _ = require('underscore');
  var Entity = require('../scene/entity');
  var Renderable = require('./components/renderable');
  var Tangible = require('./components/tangible');
  var Physical = require('./components/physical');
  
  var Pickup = function(x, y, itemId, itemData) {
    Entity.call(this, 'pickup-' + itemId);
    this.itemId = itemId;
    this.itemData = itemData;
    
    this.attach(new Renderable(itemData.pickupTexture));
    this.attach(new Tangible(x, y, itemData.pickupWidth, itemData.pickupHeight));
    this.attach(new Physical());
    this.attachSelf();
  };
  
  Pickup.prototype = {
    attachSelf: function() {
      var self = this;
      this.attach({
        giveItemTo: function(entityId) {
          self.putItemInEntity(entityId);
        },
        hasPickup: function() {
          return true;
        }    
      });
    },
    putItemInEntity: function(entityId) {
      var self = this;
      this.scene.withEntity(entityId, function(entity) {
        entity.dispatch('addInventoryItem', [self.itemId, self.itemData]); 
        self.scene.remove(self);
      })
    } 
  };
  
  _.extend(Pickup.prototype, Entity.prototype);
  
  return Pickup;
  
});
