define(function(require) {
  var _ = require('underscore');
  
  var Quest = require('../../scripting/quest');

  var QuestGiver = function(questTemplate) {
    this.questTemplate = questTemplate;
  };
  
  QuestGiver.prototype = {
    canTalk: function(entity) {
      return true;
    },
    
    getQuest: function(entity) {
      if(!entity.get('hasStartedQuest', [ this.questTemplate ]))
        return this.questTemplate;
    }
  };
  
  return QuestGiver;
});
