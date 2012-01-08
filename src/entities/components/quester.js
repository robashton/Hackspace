define(function(require) {
  var _ = require('underscore');

  var Quester = function() {
    this.quests = [];
  };
  
  Quester.prototype = {
    startQuest: function(quest) {
      this.quests.push(quest);
      quest.start(this.parent);
    }
  };
  
  return Quester;
});
