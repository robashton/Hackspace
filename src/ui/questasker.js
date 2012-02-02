define(function(require) {
  var _ = require('underscore');

  var QuestAsker = function(scene, playerId, element) {
    this.scene = scene;
    this.scene.autoHook(this);
    this.element = element;
    this.playerId = playerId;
    this.element.hide();
    this.element.find('#quest-started-accept').on({
      click: function() {
       element.hide();
      }
    });
  };
  
  QuestAsker.prototype = {
    onQuestStarted: function(questTemplate, sender) {
      if(sender.id !== this.playerId) return;
      this.element.find('#quest-started-text').text(questTemplate.meta.askText);
      this.element.show();
    },
    onTalkTo: function(data, sender) {
      if(sender.id !== this.playerId) return;
      this.element.find('#quest-started-text').text(data.text);
      this.element.show();
    }
  };
  
  return QuestAsker;
});
