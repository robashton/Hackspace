define(function(require) {
  var _ = require('underscore');
  var Quest = require('../../scripting/quest');

  var Talker = function() {
    
  };
  
  Talker.prototype = {
    onDiscussion: function(targetid) {
      var self = this;
      this.scene.withEntity(targetid, function(target) {
        var questTemplate = target.get('getQuest', [self.parent]);
        if(questTemplate)
          self.startQuestFromTemplate(questTemplate);
      });
    },
    startQuestFromTemplate: function(questTemplate) {
      this.parent.raise('QuestStarted',  questTemplate);
    },
    onQuestStarted: function(questTemplate) {
      var quest = new Quest(questTemplate);
      this.parent.dispatch('startQuest', [quest]);
    },
    onAddedToScene: function(scene) {
      this.scene = scene;
    }
  };
  
  return Talker;
});
