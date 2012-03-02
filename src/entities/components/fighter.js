define(function(require) {
  var _ = require('underscore');
  var vec3 = require('glmatrix').vec3;
  
  var Fighter = function() {
    this.currentTargetId = null;
    this.frameCount = 0;
    this.scene = null;
  };
  
  Fighter.prototype = {
  
    attack: function(targetId) {
      this.parent.raise('AttackedTarget', targetId);
    },
    
    onDestinationChanged: function() {
      if(this.currentTargetId)
        this.parent.raise("CancelledAttackingTarget");
    },
    
    onDestinationTargetChanged: function() {
      if(this.currentTargetId)
        this.parent.raise("CancelledAttackingTarget");
    },
    
    onCancelledAttackingTarget: function() {
      this.currentTargetId = null;
    },
    
    onAttackedTarget: function(targetId) {
      this.currentTargetId = targetId;
    },
    
    onKilledTarget: function() {
      this.currentTargetId = null;
    },
    
    onTick: function() {
      this.verifyTargetIsValid();
      if(this.frameCount % 30 === 0 && this.currentTargetId !== null) 
        this.performAttackStep();
      if(this.frameCount % 30 === 0 && this.currentTargetId === null)
        this.frameCount = 0;
        
      if(this.frameCount !== 0 || this.currentTargetId)
        this.frameCount++;
    },
    
    onAddedToScene: function(scene) {
      this.scene = scene;
    },
    
    verifyTargetIsValid: function() {
      var entity = this.scene.get(this.currentTargetId);
      if(!entity)
        this.parent.raise('CancelledAttackingTarget');
    },
    
    notifyKilledTarget: function(targetid) {
      this.parent.raise('KilledTarget', targetid);
    },
    
    orientTowardsTarget: function() {
      var self = this;
      this.scene.withEntity(this.currentTargetId, function(target) {
        var targetPosition = target.get('getPosition');
        var myPosition = self.parent.get('getPosition');
        
        var direction = vec3.create([0,0,0]);
        vec3.subtract(targetPosition, myPosition, direction);
        var rotation = Math.atan2(direction[0], -direction[1]);
        self.parent.dispatch('rotateTo', [rotation]);
      });
    },
    
    performAttackStep: function() {
      var self = this;
      this.parent.raise('PunchedTarget');
      this.orientTowardsTarget();
      
      this.scene.dispatch(this.currentTargetId, 'applyDamage', [{
        dealer: self.parent.id,
        physical: Math.random() * 2
      }]);
    }
  };
  
  return Fighter;
});
