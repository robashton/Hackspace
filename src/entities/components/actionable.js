define(function(require) {

  var Actionable = function() {
    this.scene = null;
  };
  
  Actionable.prototype = {
    
    onAddedToScene: function(scene) {
      this.scene = scene;
      this.seekingTarget = false;
      this.targetId = null;
    },   
    
    primaryAction: function(targetId) {
      var self = this;
      this.targetId = targetId;
      this.scene.withEntity(targetId, function(target) {
        if(target.get('CanTalk', [self], false))
          self.moveToAndExecute(target, self.discussWithTarget);
        if(self.parent.get('IsEnemyWith', [target], false))
          self.moveToAndExecute(target, self.attackTarget);
        else if(target.get('HasPickup', [], false))
           self.moveToAndExecute(target, self.pickupTarget);
      });
    },

    moveToAndExecute: function(target, callback) {
      this.parent.dispatch('updateDestinationTarget', [target.id]);
      this.seekingTarget = true;
      this.targetId = target.id;
      this.actionOnDestinationReached = callback;
    },
        
    onDestinationReached: function() {
      if(this.seekingTarget) {
        this.actionOnDestinationReached();
        this.seekingTarget = false;
        this.targetId = null;      
      }
    },
    
    discussWithTarget: function() {
      this.parent.raise('Discussion', this.targetId);
    },    
        
    attackTarget: function() {
      this.parent.dispatch('attack', [this.targetId]);
    },    
    
    pickupTarget: function() {
      var self = this;
      this.scene.dispatch(this.targetId, 'giveItemTo', [ self.parent.id ]);
    },
    
    onDestinationChanged: function() {
      this.seekingTarget = false;
      this.actionOnDestinationReached = false;
      this.targetId = null;
    }
  };
  
  return Actionable;
});
