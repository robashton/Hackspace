define(function(require) {

  var _ = require('underscore');
  var Entity = require('../scene/entity');
  var Renderable = require('./components/renderable');
  var Tangible = require('./components/tangible');

  var Pickup = function(x, y, item) {
    Entity.call(this, 'pickup-' + item.id);
    this.item = item;
    
    this.attach(new Renderable(item.pickupTexture));
    this.attach(new Tangible(x, y, item.pickupWidth, item.pickupHeight));
  };
  
  Pickup.prototype = {
    
  };
  
  _.extend(Pickup.prototype, Entity.prototype);
  
  return Pickup;
  
});
