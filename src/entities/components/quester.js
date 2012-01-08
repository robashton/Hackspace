define(function() {

  var Quester = function(questFactory) {
    this.questFactory = questFactory;
  };
  
  Quester.prototype = {
    onAddedToScene: function(scene) {
      this.scene = scene;
    },
    
    startQuest: function(questid) {
      var quest = this.questFactory.get(questId);
      this.hookQuestEvents(quest);
    },
    
    hookQuestEvents: function(quest) {
      var self = this;
      quest.start(this.parent);
      quest.on('Finished', function() {
        self.onQuestFinished(quest);
      });
    },
    onQuestFinished: function(quest) {
      this.unhookQuestEvents(quest);
    },
    unhookQuestEvents: function(quest) {
      quest.stop();
    }
  };
  
  return Quester;
});
