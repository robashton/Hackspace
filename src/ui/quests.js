define(function(require) {
  var _ = require('underscore');

  var Quests = function(scene, playerId) {
    this.scene = scene;
    this.playerId = playerId;
    this.scene.autoHook(this);
  };
  
  Quests.prototype = {
    onQuestStarted: function(info, sender) {
      if(sender.id !== this.playerId) return;
    };
    onQuestUpdated: function(info, sender) {     
     if(sender.id !== this.playerId) return;
    }
  };
  
  return Quests;
});
