define(function(require) {

  var _ = require('underscore');
  var Entity = require('../scene/entity');

  var Controller = function() {
    Entity.call(this, "controller");   
    this.scene = null;
    
    var self = this;
    this.attach({
      onAddedToScene: function(scene) {
        self.scene = scene;
        self.hookSceneEvents(scene);
      }
    });
  };  
  Controller.prototype = {
    hookSceneEvents: function(scene) {
      var self = this;
      scene.on('PrimaryAction', function(data) {
        self.issueMovementCommandToPlayer(data.x, data.y);
      });
    },
    
    issueMovementCommandToPlayer: function(x, y) {
      this.scene.dispatch('player', 'updateDestination', [x, y]);
    }
  };  
  _.extend(Controller.prototype, Entity.prototype);
  
  return Controller;
});
