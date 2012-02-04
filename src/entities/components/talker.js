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
    talkTo: function(targetId, text) {
      this.parent.raise('TalkedTo', {
        targetId: targetId,
        text: text
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
