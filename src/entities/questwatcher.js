define(function(require) {
  var _ = require('underscore');
  var Quest = require('../scripting/quest');

  // My job is to watch the scene and hand out quests to entities
  // I also watch the state of the quests for each entity and notify those entities and the scene
  // When states change within a quest
  // The reason I do this, is that the client doesn't need to know about quests and such things - it's irrelevant, the logic will be ran on the server
  // What needs to happen is the client needs to be told when a quest is changed or updated so that their UI can update - no more than that
  
  var QuestWatcher = function(scene, persistence, questFactory) {
    this.scene = scene;
    this.persistence = persistence;
    this.trackedQuestData = {};
    this.trackedQuests = {};
    this.hookSceneEvents();
    this.questFactory = questFactory;
  };
  
  QuestWatcher.prototype = {
    hookSceneEvents: function() {
      this.scene.on('Discussion', this.onEntityTalkedToNpc, this);
    },
    
    onEntityTalkedToNpc: function(targetId, sender) {
      var questId = this.findQuestToStart(targetId, sender.id);
      if(!questId) return;
      this.startQuestForEntity(sender.id, questId);
    },
    
    findQuestToStart: function(giverId, receiverId) {
      var giver = this.scene.get(giverId);
      var questId = giver.get('getQuest');
      if(this.questStarted(receiverId, questId)) return null;
      return questId;
    },
    
    startQuestForEntity: function(entityId, questId) {
      var template = this.questFactory.get(questId);
      var quest = new Quest(template);
      var entity = this.scene.get(entityId);
      quest.start(entity);
      this.updateQuestForPlayer(entityId, quest); 
      this.notifyEntityOfQuestStart(entityId, quest);
      this.trackQuest(entityId, quest);    
    },
    
    notifyEntityOfQuestStart: function(entityId, quest) {
      this.scene.dispatch(entityId, 'startQuest', [ {
          id: quest.meta.id,
          description: quest.currentDescription(),
          title: quest.meta.title,
          completed: false,
          askText: quest.meta.askText 
        }]);
    },
    
    questStarted: function(entityId, questId) {
      return !!this.trackedQuestData[entityId][questId];
    },
    
    trackQuest: function(playerId, quest) {
      this.trackedQuests[playerId][quest.meta.id] = quest;
      quest.on('Updated', this.onQuestUpdated, this);
      quest.on('Completed', this.onQuestCompleted, this);
    },
    
    onQuestUpdated: function(data, sender) {
      this.scene.dispatch(sender.entity.id, 'updateQuest', [{
        id: sender.meta.id,
        description: sender.currentDescription(),
        title: sender.meta.title,
        completed: false
      }]);
      this.updateQuestForPlayer(sender.entity.id, sender);
    },
    
    onQuestCompleted: function(data, sender) {
      this.scene.dispatch(sender.entity.id, 'updateQuest', [{
        id: sender.meta.id,
        description: sender.currentDescription(),
        title: sender.meta.title,
        completed: true
      }]);
      this.updateQuestForPlayer(sender.entity.id, sender);
      this.removeQuestForPlayer(sender.entity.id, sender);
    },
    
    loadQuestsForPlayer: function(playerId, callback) {
      var self = this;
      this.persistence.retrieveQuestsForPlayer(playerId, function(data) {
        self.trackedQuests[playerId] = {};
        self.trackedQuestData[playerId] = data;
        self.loadPlayerQuestDataIntoQuests(playerId, callback);
      });
    },
    
    loadPlayerQuestDataIntoQuests: function(playerId, callback) {
      var data = this.trackedQuestData[playerId];
      for(var questId in data) {
        var item = data[questId];
        if(item.complete) continue; // Don't bother initializing quests that are already completed
        
        var template = this.questFactory.get(questId);
        var quest = new Quest(template);
        var player = this.scene.get(playerId);
        
        quest.start(player);
        quest._in(item);

        this.trackQuest(playerId, quest);
      }
      callback();
    },
    
    removeQuestForPlayer: function(playerId, quest) {
      delete this.trackedQuests[playerId][quest.meta.id];
    },
    
    unloadQuestsForPlayer: function(playerId) {
      delete this.trackedQuestData[playerId];
      delete this.trackedQuests[playerId];
    },
    
    updateQuestForPlayer: function(playerId, quest) {
      var data = {};
      quest._out(data);
      
      data.complete = quest.complete;
      this.trackedQuestData[playerId][quest.meta.id] = data;
      this.persistence.saveQuestsForPlayer(playerId, this.trackedQuestData[playerId]);
    }
  };
  
  return QuestWatcher;
});
