define(function(require) {
  var _ = require('underscore');
  
  var Quest = require('../../scripting/quest');

  var QuestGiver = function(questTemplate) {
    this.questTemplate = questTemplate;
  };
  
  QuestGiver.prototype = {
    takeQuest: function(entity) {
      var quest = new Quest(this.questTemplate);
      entity.dispatch('startQuest', [quest]);
    },
    hasQuests: function() {
      return true;
    }
  };
  
  return QuestGiver;
});
