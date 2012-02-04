define(function(require) {
  var _ = require('underscore');
  var Quest = require('../scripting/quest');

  // My job is to watch the scene and hand out quests to entities
  // I also watch the state of the quests for each entity and notify those entities and the scene
  // When states change within a quest
  // The reason I do this, is that the client doesn't need to know about quests and such things - it's irrelevant, the logic will be ran on the server
  // What needs to happen is the client needs to be told when a quest is changed or updated so that their UI can update - no more than that
  
  var QuestWatcher = function(scene, questFactory) {
    this.scene = scene;
    this.trackedQuests = [];
    this.hookSceneEvents();
    this.questFactory = questFactory;
  };
  
  QuestWatcher.prototype = {
    hookSceneEvents: function() {
      this.scene.on('QuestRequested', this.onQuestGivenToEntity, this);
    },
    onQuestGivenToEntity: function(questId, sender) {
      var template = this.questFactory.get(questId);
      var quest = new Quest(template);
      quest.start(sender);
      this.trackedQuests.push(quest);
      
      this.scene.dispatch(sender.id, 'startQuest', [ template.meta ]);
    }
  };
  
  return QuestWatcher;
});
