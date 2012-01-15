define(function(require) {

  var _ = require('underscore');
  var Eventable = require('../shared/eventable');

  var Quest = function(questTemplate) {
    Eventable.call(this);
    this.questTemplate = questTemplate;
    _.extend(this, questTemplate)
  };
  
  Quest.prototype = {
  
    start: function(entity) {
      this.entity = entity;
      this.scene = entity.scene;
      this.hookEntityEvents();
      this.init();
    },  
    
    madeFromTemplate: function(template) {
      return this.questTemplate === template;
    }, 
        
    hookEntityEvents: function() {
      this.entity.autoHook(this);
    },
    
    markUpdated: function() {
      this.raise('Updated');
    },
    
    markComplete: function() {
      this.raise('Completed');
      this.stop();
    },
    
    stop: function() {
      this.entity.autoUnhook(this);
    }
  };
  
  _.extend(Quest.prototype, Eventable.prototype);
  
  return Quest;
});
