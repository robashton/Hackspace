define(function(require) {
  var _ = require('underscore');

  var Quester = function() {
    this.quests = {};
  };
  
  Quester.prototype = {
    onQuestStarted: function(info) {
      this.quests[info.meta.id] = info;
    },
    onQuestUpdated: function(info) {
      this.quests[info.meta.id] = info;
    },
    startQuest: function(info) {
      this.parent.raise('QuestStarted', info);
    },
    updateQuest: function(info) {
      this.parent.raise('QuestUpdated', info);
    },
    _setQuestData: function(data) {
      this.quests = data;
      this.parent.raise('QuestDataUpdated', data);
    }
  };
  
  return Quester;
});
