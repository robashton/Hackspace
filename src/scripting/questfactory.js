define(function(require) {
  var _ = require('underscore');
  var FetchDucks = require('./quests/fetchducks');

  var QuestFactory = function(socket) {
    this.socket = socket;
    this.quests = {
      "fetchducks": FetchDucks  
    }
  };
  
  QuestFactory.prototype = {
    get: function(id) {
      return this.quests[id];
    }
  };
  
  return QuestFactory;
});
