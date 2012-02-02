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
    
    performAttackStep: function() {
      var self = this;
      this.parent.raise('PunchedTarget');
      
      this.scene.dispatch(this.currentTargetId, 'applyDamage', [{
        dealer: self.parent.id,
        physical: Math.random() * 2
      }]);
    }
  };
  
  return Fighter;
});
