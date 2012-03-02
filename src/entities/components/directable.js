define(function(require) {

  var vec3 = require('glmatrix').vec3;

  var Directable = function(speed) {
    this.position = vec3.create([0,0,0]);
    this.direction = vec3.create([0,0,0]);
    this.destination = vec3.create([0,0,0]);
    this.buffer = vec3.create([0,0,0]);
    this.speed = speed;
    this.moving = false;
    this.targetId = null;
    this.desiredDistanceFromTarget = 5.0;
    this.scene = null;
  };
  
  Directable.prototype = {    
    updateDestination: function(x, y, z) {
      this.parent.raise('DestinationChanged', {
        x: x || 0,
        y: y || 0,
        z: z || 0
      });
    },
    updateDestinationTarget: function(targetId) {
      this.parent.raise('DestinationTargetChanged', targetId);
    },
    
    onPositionChanged: function(data) {
      this.position[0] = data.x;
      this.position[1] = data.y;
      this.position[2] = data.z;
    },
    
    onDestinationChanged: function(data) {
      this.destination[0] = data.x;
      this.destination[1] = data.y;
      this.destination[2] = data.z;
      this.calculateNewDirection();
      this.moving = true;
      this.targetId = null;
      this.desiredDistanceFromTarget = 5.0;
    },
    
    onDestinationTargetChanged: function(targetId) {
      this.targetId = targetId;
      this.moving = true;
    },
    
    onTick: function() {
      if(this.moving) {
        this.updateDestinationIfNecessary();
        this.moveTowardsDestination();
        this.determineIfDestinationReached()
      }
    },
    
    onDestinationReached: function() {
      this.moving = false;
      this.targetId = null;
    },
    
    onAddedToScene: function(scene) {
      this.scene = scene;
    },
    
    calculateNewDirection: function() {
      vec3.subtract(this.destination, this.position, this.direction);
      vec3.normalize(this.direction);
    },
    
    updateDestinationIfNecessary: function() {
      var self = this;
      if(!this.targetId) return;
                  
      var bounds = this.scene.fromEntity(this.targetId, 'getBounds');
      var myBounds = this.parent.get('getBounds');
      if(!bounds) return;
      
      this.desiredDistanceFromTarget = (bounds.circle.radius + myBounds.circle.radius) + 2;
      this.destination[0] = bounds.circle.x;
      this.destination[1] = bounds.circle.y;
      this.calculateNewDirection();    
    },
    
    determineIfDestinationReached: function() {
      vec3.subtract(this.destination, this.position, this.buffer);
      var length = vec3.length(this.buffer);
      if(length < (this.desiredDistanceFromTarget))
        this.parent.raise('DestinationReached');
    },
    
    onCollided: function(data) {
      if(this.targetId && data.collidedEntityId === this.targetId)
        this.parent.raise('DestinationReached');
    },
    
    onCollisionFrictionRequested: function(e) {
      if(this.moving) {
        e.score -= 1.0; 
      }
    },
    
    moveTowardsDestination: function() {
      this.parent.dispatch('moveTo', [
        this.position[0] + this.direction[0] * this.speed,
        this.position[1] + this.direction[1] * this.speed,
        this.position[2] + this.direction[2] * this.speed
      ]); 
      this.parent.dispatch('rotateTo', [Math.atan2(this.direction[0], -this.direction[1])]);
    }
  };  
  
  return Directable;
  
});
