define(function(require) {

  var _ = require('underscore');
  var Entity = require('../scene/entity');

  var Controller = function() {
    Entity.call(this, "controller");   
    this.scene = null;
        
    this.on('AddedToScene', this.hookSceneEvents);
  };  
  Controller.prototype = {
    hookSceneEvents: function(scene) {
      scene.on('PrimaryAction', this.issueMovementCommandToPlayer, this);
    },
    
    issueMovementCommandToPlayer: function(data) {
      this.scene.dispatch('player', 'updateDestination', [data.x, data.y]);
    }
  };  
  _.extend(Controller.prototype, Entity.prototype);
  
  return Controller;
});
