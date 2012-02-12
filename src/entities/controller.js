define(function(require) {

  var _ = require('underscore');
  var Entity = require('../scene/entity');
  var $ = require('jquery');
  var Coords = require('../shared/coords');

  var Controller = function(element, commander) {
    Entity.call(this, "controller");   
    this.scene = null;        
    this.on('AddedToScene', this.hookSceneEvents);
    this.x = 0;
    this.y = 0;   
    this.commander = commander;
    this.element = $(element);
    this.isHovering = false;
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
      if(selectedEntity && !this.isHovering) {
        this.element.css('cursor', 'pointer');
        this.isHovering = true;
      } else if(!selectedEntity && this.isHovering) {
        this.element.css('cursor', 'default');
        this.isHovering = false;
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
      this.commander.dispatch("primaryAction", [entity.id]);
    },
    
    issueMovementCommandToPlayer: function(x,y) {
      this.commander.dispatch('updateDestination', [x, y]);
    }
  };  
  _.extend(Controller.prototype, Entity.prototype);
  
  return Controller;
});
