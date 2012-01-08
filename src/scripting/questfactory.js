define(function() {

  var FetchDucks = require('./quests/fetchducks.js');

  var QuestFactory = function(scene) {
    this.scene = scene;
  };
  
  QuestFactory.prototype = {
    get: function(questId) {
      return new FetchDucks();
    }
  };
  
  return QuestFactory;
});
