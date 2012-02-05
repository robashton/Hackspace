define(function(require) {
  var _ = require('underscore');
  var Quest = require('../../scripting/quest');

  var Talker = function() {
    
  };
  
  Talker.prototype = {
    talkTo: function(targetId, text) {
      this.parent.raise('TalkedTo', {
        targetId: targetId,
        text: text
      });
    },
    startQuest: function(info) {
      this.parent.raise('QuestStarted', info);
    },
    updateQuest: function(info) {
      this.parent.raise('QuestUpdated', info);
    },
    onAddedToScene: function(scene) {
      this.scene = scene;
    }
  };
  
  return Talker;
});
