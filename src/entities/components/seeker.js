define(function(require) {
  var _ = require('underscore');
  var vec3 = require('glmatrix').vec3;
  
  var Seeker = function(targetId) {
    this.targetId = targetId;
    this.scene = null;
    this.seeking = false;
    this.found = false;
    this.buffer = vec3.create([0,0,0]);
    this.position = vec3.create([0,0,0]);
    this.targetPosition = null;
    this.viewingDistance = 30;
  };
  
  Seeker.prototype = {
    onTick: function() {   
      this.updateTargetPosition();  
      if(this.targetPosition)
        this.determineTargetProximity();        
    },
    
    updateTargetPosition: function() {
      var self = this;
      this.scene.withEntity(this.targetId, function(target) {
        self.targetPosition = target.get('getPosition');          
      });
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
     
    determineTargetProximity: function() {      
      vec3.subtract(this.position, this.targetPosition, this.buffer);
      var distance = vec3.length(this.buffer);
      if(distance < 128 && !this.found) {
        this.parent.dispatch('updateDestinationTarget', [this.targetId]);
      }
      else if(distance > 30 && this.found) {
        this.parent.dispatch('updateDestinationTarget', [this.targetId]);
      }
    }
  };
  
  return Seeker;
});
