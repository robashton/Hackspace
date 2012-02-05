define(function(require) {
  var _ = require('underscore');

  var Talker = function() {
    
  };
  
  Talker.prototype = {
    talkTo: function(targetId, text) {
      this.parent.raise('TalkedTo', {
        targetId: targetId,
        text: text
      });
    },
    onAddedToScene: function(scene) {
      this.scene = scene;
    }
  };
  
  return Talker;
});
