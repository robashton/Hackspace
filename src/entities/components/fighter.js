define(function(require) {
  var _ = require('underscore');

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
    
    onTick: function() {
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
    
    notifyKilledTarget: function(targetid) {
      this.parent.raise('KilledTarget', targetid);
    },
    
    performAttackStep: function() {
      var self = this;
      this.scene.withEntity(this.currentTargetId, function(target) {
        target.dispatch('applyDamage', [{
          dealer: self.parent.id,
          physical: Math.random() * 2
        }]);
      });
    }
  };
  
  return Fighter;
});
