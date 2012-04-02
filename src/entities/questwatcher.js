define(function(require) {
  var _ = require('underscore');
  var Quest = require('../scripting/quest');
 
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
    
    onEntityTalkedToNpc: function(npcId, sender) {
      var questId = this.findQuestToStart(npcId, sender.id);
      if(!questId) return;
      this.startQuestForEntity(sender.id, questId, npcId);
    },
    
    findQuestToStart: function(npcId, receiverId) {
      var giver = this.scene.get(npcId);
      var questId = giver.get('Quest');
      if(this.hasQuestBeenStartedForEntity(receiverId, questId)) return null;
      return questId;
    },
    
    startQuestForEntity: function(entityId, questId, npcId) {
      var template = this.questFactory.get(questId);
      var quest = new Quest(template);
      var entity = this.scene.get(entityId);
      quest.start(entity, npcId);
      this.updateQuestForPlayer(entityId, quest); 
      this.notifyEntityOfQuestStart(entityId, quest);
      this.trackQuest(entityId, quest);    
    },
    
    notifyEntityOfQuestStart: function(entityId, quest) {
      this.scene.dispatch(entityId, 'startQuest', [this.trackedQuestData[entityId][quest.meta.id] ]);
    },
    
    hasQuestBeenStartedForEntity: function(entityId, questId) {
      return !!this.trackedQuestData[entityId][questId];
    },
    
    trackQuest: function(playerId, quest) {
      this.trackedQuests[playerId][quest.meta.id] = quest;
      quest.on('Updated', this.onQuestUpdated, this);
      quest.on('Completed', this.onQuestCompleted, this);
    },
    
    onQuestUpdated: function(data, sender) {
      this.updateQuestForPlayer(sender.entity.id, sender);
      this.scene.dispatch(sender.entity.id, 'updateQuest', [this.trackedQuestData[sender.entity.id][sender.meta.id] ]);
    },
    
    onQuestCompleted: function(data, sender) {
      this.updateQuestForPlayer(sender.entity.id, sender);
      this.removeQuestForPlayer(sender.entity.id, sender);
      this.scene.dispatch(sender.entity.id, 'updateQuest', [this.trackedQuestData[sender.entity.id][sender.meta.id] ]);
    },
    
    loadQuestsForPlayer: function(playerId, callback) {
      var self = this;
      this.persistence.retrieveQuestsForPlayer(playerId, function(data) {
        self.trackedQuests[playerId] = {};
        self.trackedQuestData[playerId] = data;
        self.loadPlayerQuestDataIntoQuests(playerId, function() {
          self.scene.dispatch(playerId, '_setQuestData', [ data ]);
          callback();
        });
      });
    },
    
    loadPlayerQuestDataIntoQuests: function(playerId, callback) {
      var data = this.trackedQuestData[playerId];
      for(var questId in data) {
        var item = data[questId];
        if(item.complete) continue;
        this.initializeQuestFromData(playerId, questId, item);        
      }
      callback();
    },
    
    initializeQuestFromData: function(playerId, questId, data) {
      var template = this.questFactory.get(questId);
      var quest = new Quest(template);
      var player = this.scene.get(playerId);
      
      quest.start(player);
      quest._setQuestData(data);

      this.trackQuest(playerId, quest);
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
      quest._getQuestData(data);
      this.trackedQuestData[playerId][quest.meta.id] = data;
      this.persistence.saveQuestsForPlayer(playerId, this.trackedQuestData[playerId]);
    }
  };
  
  return QuestWatcher;
});
