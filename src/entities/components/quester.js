define(function(require) {
  var _ = require('underscore');

  var Quester = function() {
    this.quests = [];
  };
  
  Quester.prototype = {
    startQuest: function(quest) {
      this.quests.push(quest);
      quest.start(this.parent);
    },
    hasStartedQuest: function(template) {
      return !!_(this.quests).find(function(quest) {
        return quest.madeFromTemplate(template);
      });
    }
  };
  
  return Quester;
});
