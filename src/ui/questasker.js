define(function(require) {
  var _ = require('underscore');

  var QuestAsker = function(scene, element) {
    this.scene = scene;
    this.scene.autoHook(this);
    this.element = element;
    this.element.hide();
    this.element.find('#quest-started-accept').on({
      click: function() {
       element.hide();
      }
    });
  };
  
  QuestAsker.prototype = {
    onQuestStarted: function(questTemplate) {
      this.element.find('#quest-started-text').text(questTemplate.meta.askText);
      this.element.show();
    },
    onTalkTo: function(data) {
      this.element.find('#quest-started-text').text(data.text);
      this.element.show();
    },
  };
  
  return QuestAsker;
});
