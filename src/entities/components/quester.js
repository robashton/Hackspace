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
    hasStartedQuest: function(id) {
      return !!this.quests[id];
    }
  };
  
  return Quester;
});
