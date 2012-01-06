define(function(require) {

  var vec3 = require('glmatrix').vec3;

  var Directable = function(speed) {
    this.position = vec3.create([0,0,0]);
    this.direction = vec3.create([0,0,0]);
    this.destination = vec3.create([0,0,0]);
    this.buffer = vec3.create([0,0,0]);
    this.speed = speed;
    this.moving = false;
  };
  
  Directable.prototype = {    
    updateDestination: function(x, y, z) {
      this.parent.raise('DestinationChanged', {
        x: x || 0,
        y: y || 0,
        z: z || 0
      });
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
    },
    onClippedTerrain: function(data) {
      this.moving = false;
    },
    calculateNewDirection: function() {
      vec3.subtract(this.destination, this.position, this.direction);
      vec3.normalize(this.direction);
    },
    onTick: function() {
      if(this.moving) {
        this.moveTowardsDestination();
        this.determineIfDestinationReached()
      }
      this.parent.raise('Debug', 'Player: ' + [this.position[0], this.position[1], this.position[2]]);
    },
    determineIfDestinationReached: function() {
      vec3.subtract(this.destination, this.position, this.buffer);
      var length = vec3.length(this.buffer);
      if(length < 5) {
        this.moving = false;
        this.parent.raise('DestinationReached');
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
