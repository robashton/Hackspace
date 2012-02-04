define(function(require) {
  var _ = require('underscore');
  
  var Quest = require('../../scripting/quest');

  var QuestGiver = function(questId) {
    this.questId = questId;
    this.scene = null;
  };
  
  QuestGiver.prototype = {
  
    onAddedToScene: function(scene) {
      this.scene = scene;
    },
    
    canTalk: function(entity) {
      return true;
    },
    
    getQuest: function(entity) {
      if(!entity.get('hasStartedQuest', [ this.questId ])) {
        return this.questId;
      }
    }
  };
  
  return QuestGiver;
});
