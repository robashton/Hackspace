define(function(require) {
  var _ = require('underscore');

  var Quester = function() {
    this.quests = {};
  };
  
  Quester.prototype = {
    startQuest: function(info) {
      this.quests[info.id] = info;
      this.parent.raise('QuestStarted', info);
    },
    updateQuest: function(info) {
      this.quests[info.id] = info;
    },
    hasStartedQuest: function(id) {
      return !!this.quests[id];
    },
    _out: function(data) {
      data.quests = this.quests;
    },
    _in: function(data) {
      this.quests = data.quests;
      console.log(this.quests);
    }
  };
  
  return Quester;
});
