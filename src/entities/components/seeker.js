define(function(require) {
  var _ = require('underscore');
  var vec3 = require('glmatrix').vec3;
  
  var Seeker = function() {
    this.targetId = null;
    this.scene = null;
    this.seeking = false;
    this.found = false;
    this.buffer = vec3.create([0,0,0]);
    this.position = vec3.create([0,0,0]);
    this.targetPosition = vec3.create([0,0,0]);
    this.viewingDistance = 30;
  };
  
  Seeker.prototype = {
  
    onTick: function() {
      this.lookForCandidates();
      this.updateTargetPosition();
      this.determineTargetProximity(); 
    },
   
    onPositionChanged: function(data) {
      this.position[0] = data.x;
      this.position[1] = data.y;
      this.position[2] = data.z;
    },
    
    onAddedToScene: function(scene) {
      this.scene = scene;
    },
    
    onDestinationTargetChanged: function() {
      this.seeking = true;
      this.found = false;
    },
    
    onDestinationReached: function() {
      if(this.seeking) {
       this.found = true;
       this.seeking = false;
      }
    },
    
    resetSeekState: function() {
       this.found = false;
       this.seeking = false;
       this.targetId = null;
    },
    
    updateTargetPosition: function() {
      if(!this.targetId) return;
      var target = this.scene.get(this.targetId);
      if(target) {
        var targetPosition = target.get('getPosition');
        vec3.set( targetPosition, this.targetPosition);
      } else {
        this.targetId = null;
      }
    },
    
    lookForCandidates: function() {
      if(this.targetId) return;
      var self = this;
      var availableTargets = this.scene.entitiesWithinRadius(this.position, 100.0, function(entity) {
        return entity.get('isEnemyWith', [self.parent]);
      });
      if(availableTargets.length > 0) {
        this.targetId = availableTargets[0].id;
      }
    },
     
    determineTargetProximity: function() {      
      vec3.subtract(this.position, this.targetPosition, this.buffer);
      var distance = vec3.length(this.buffer);
      if(distance < 128 && !this.found) {
        this.scene.dispatch(this.parent.id, 'updateDestinationTarget', [ this.targetId ]);
      }
      else if(distance > 30 && this.found) {
        this.scene.dispatch(this.parent.id, 'updateDestinationTarget', [ this.targetId ]);
      }
    }
  };
  
  return Seeker;
});
