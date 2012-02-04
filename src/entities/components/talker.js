define(function(require) {
  var _ = require('underscore');
  var Quest = require('../../scripting/quest');

  var Talker = function() {
    
  };
  
  Talker.prototype = {
    onDiscussion: function(targetid) {
      var self = this;
      this.scene.withEntity(targetid, function(target) {
        var questId = target.get('getQuest', [self.parent]);
        if(questId)
          self.requestStartQuest(questId);
      });
    },
    requestStartQuest: function(questId) {
      this.parent.raise('QuestRequested', questId);
    },
    onAddedToScene: function(scene) {
      this.scene = scene;
    }
  };
  
  return Talker;
});
