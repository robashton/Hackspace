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
        console.log('gagh');
        var position = target.get('position');
        self.parent.dispatch('updateDestination', position);
        self.seekingTarget = true;
        self.targetId = targetId;
      });
    },
    
    onDestinationReached: function() {
      if(this.seekingTarget) {
        this.actionOnTarget(this.targetId);
        this.seekingTarget = false;
        this.targetId = null; 
      }
    },
    
    actionOnTarget: function(targetId) {
      console.log('Actioned');      
    },
    
    onDestinationChanged: function() {
      this.seekingTarget = false;
    }
  };
  
  return Actionable;
});
