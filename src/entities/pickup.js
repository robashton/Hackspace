define(function(require) {

  var _ = require('underscore');
  var Entity = require('../scene/entity');
  var Renderable = require('./components/renderable');
  var Tangible = require('./components/tangible');
  var Physical = require('./components/physical');
  
  var Pickup = function(x, y, item) {
    Entity.call(this, 'pickup-' + item.id);
    this.item = item;
    
    this.attach(new Renderable(item.pickupTexture));
    this.attach(new Tangible(x, y, item.pickupWidth, item.pickupHeight));
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
        entity.dispatch('add', [self.item]); 
        self.scene.remove(self);
      })
    } 
  };
  
  _.extend(Pickup.prototype, Entity.prototype);
  
  return Pickup;
  
});
