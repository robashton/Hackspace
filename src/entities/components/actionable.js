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
        if(target.get('hasQuests', [], false)) {
          self.getQuest(target);
        }
      });
    },
    
    getQuest: function(target) {
      var position = target.get('getPosition');
      this.parent.dispatch('updateDestination', [position[0], position[1]]);
      this.seekingTarget = true;
      this.targetId = target.id;
      this.actionOnDestinationReached = this.getQuestFromTarget;
    },
    
    onDestinationReached: function() {
      if(this.seekingTarget) {
        this.actionOnDestinationReached();
        this.seekingTarget = false;
        this.targetId = null; 
      }
    },
    
    getQuestFromTarget: function() {
      var self = this;
      this.scene.withEntity(this.targetId, function(target) {
        target.dispatch('takeQuest', [self.parent]);
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
