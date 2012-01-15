define(function(require) {

  var _ = require('underscore');
  var Entity = require('../scene/entity');
  var Coords = require('../shared/coords');

  var Controller = function() {
    Entity.call(this, "controller");   
    this.scene = null;        
    this.on('AddedToScene', this.hookSceneEvents);
    this.x = 0;
    this.y = 0;   
  };  
  
  Controller.prototype = {
    hookSceneEvents: function(scene) {
      var self = this;
      scene.on('PrimaryAction', this.determineWherePrimaryActionRequested, this);
      scene.on('Hover', this.onHover, this);
      setInterval(function() {
        self.determineWhatMouseIsOver();
      }, 200);
    },
  
    determineWhatMouseIsOver: function() {
      var selectedEntity = this.scene.entityAtMouse(this.x, this.y);
      if(selectedEntity) {
      //  console.log(selectedEntity.id);
      } else {
      
      }    
    },
    
    
    onHover: function(data) {
      this.x = data.x;
      this.y = data.y;
    },
    
    determineWherePrimaryActionRequested: function(data) {
      var x = data.x,
          y = data.y;
      
      var selectedEntity = this.scene.entityAtMouse(x, y);
      if(selectedEntity)
        this.determineWhatToDoWithSelectedEntity(selectedEntity, x, y);
      else
        this.issueMovementCommandToPlayer(x,y);
      
    },
    
    determineWhatToDoWithSelectedEntity: function(entity, x, y) {
      this.scene.dispatch('player', "primaryAction", [entity.id]);
    },
    
    issueMovementCommandToPlayer: function(x,y) {
      this.scene.dispatch('player', 'updateDestination', [x, y]);
    }
  };  
  _.extend(Controller.prototype, Entity.prototype);
  
  return Controller;
});
