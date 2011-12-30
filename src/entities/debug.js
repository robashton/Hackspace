define(function(require) {

  var _ = require('underscore');
  var Entity = require('../scene/entity');

  var Debug = function() {
    Entity.call(this, "debug");   
    this.scene = null;
        
    this.on('Tick', this.clearDebug);
    this.on('AddedToScene', this.hookSceneEvents);
  };  
  Debug.prototype = {
    hookSceneEvents: function(scene) {
      scene.on('Debug', this.addDebugMessage, this);
    },
    clearDebug: function() {
      $('#debug').html('');
    },
    addDebugMessage: function(data) {
       var msg = $('<p/>');
       msg.text(data.toString());
       $('#debug').append(msg);
    }
  };  
  _.extend(Debug.prototype, Entity.prototype);
  
  return Debug;
});
