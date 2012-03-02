define(function(require) {
  var _ = require('underscore');
  var Entity = require('../scene/entity');
  
  var Collider = function() {
    Entity.call(this, "Collision");
    this.on('Tick', this.onColliderTick);
  };
  
  Collider.prototype = {
    onColliderTick: function() {
      this.scene.crossEach(this.collideEntities, this);
    },
    collideEntities: function(i, j, entityOne, entityTwo) {
      var boundsOne = entityOne.get('getBounds');
      var boundsTwo = entityTwo.get('getBounds');
      if(!boundsOne || !boundsTwo) return;
      
      var result = this.intersect(boundsOne, boundsTwo);
      
      if(result.intersects) {
        result.collidedEntityId = entityTwo.id;       
        entityOne.dispatch('collide', [result]);
        result.x = -result.x;
        result.y = -result.y;
        result.collidedEntityId = entityOne.id;
        entityTwo.dispatch('collide', [result]);
      }      
    },
    intersect: function(one, two) {
      var intersectResult = {
        x: 0, y: 0, intersects: false
      };
      if(one.x > two.x + two.width) return intersectResult;
      if(one.y > two.y + two.height) return intersectResult;
      if(one.x + one.width < two.x) return intersectResult;
      if(one.y + one.height < two.y) return intersectResult;

      intersectResult.intersects = true;

      // Clip right
      if(one.x + one.width > two.x && 
         one.x + one.width < two.x + two.width &&
         one.y + (one.height / 2.0) > two.y &&
         one.y + (one.height / 2.0) < two.y + two.height) {
         
        intersectResult.x = two.x - (one.x + one.width); // Return a negative value indicating the desired change
        return intersectResult;     
      }
     
      // Clip left
      if(one.x > two.x && 
         one.x < two.x + two.width &&
         one.y + (one.height / 2.0) > two.y &&
         one.y + (one.height / 2.0) < two.y + two.height) {
          
        intersectResult.x = (two.x + two.width) - one.x;  // Return a positive value indicating the desired change
        return intersectResult;     
      }

      // Clip bottom
      if(one.x + (one.width / 2.0) > two.x && 
         one.x + (one.width / 2.0) < two.x + two.width &&
         one.y + one.height > two.y &&
         one.y + one.height < two.y + two.height) {

        intersectResult.y =  two.y - (one.y + one.height); // Return a negative value indicating the desired change
        return intersectResult;     
      }
      
      // Clip Top
      if(one.x + (one.width / 2.0) > two.x && 
         one.x + (one.width / 2.0) < two.x + two.width &&
         one.y > two.y &&
         one.y < two.y + two.height) {

        intersectResult.y =   (two.y + two.height) - one.y; // Return a negative value indicating the desired change
        return intersectResult;     
      }

      return intersectResult;
    }
  };
  _.extend(Collider.prototype, Entity.prototype);
  
  return Collider;
});
