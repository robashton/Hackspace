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
      this.scene.withEntity(targetId, function(target) {
        if(target.get('canTalk', [self], false))
          self.moveToAndExecute(target, self.discussWithTarget);
        else if(target.get('hasPickup', [], false))
           self.moveToAndExecute(target, self.pickupTarget);
      });
    },
    
    moveToAndExecute: function(target, callback) {
      var position = target.get('getPosition');
      this.parent.dispatch('updateDestination', [position[0], position[1]]);
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
    
    pickupTarget: function() {
      var self = this;
      this.scene.withEntity(this.targetId, function(target) {
        target.dispatch('giveItemTo', [ self.parent.id ]);
      });
    },
    
    onDestinationChanged: function() {
      this.seekingTarget = false;
      this.actionOnDestinationReached = false;
      this.targetId = null;
    }
  };
  
  return Actionable;
});
