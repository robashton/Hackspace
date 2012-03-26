define(function(require) {

  var _ = require('underscore');
  var Eventable = require('../shared/eventable');

  var Quest = function(questTemplate) {
    Eventable.call(this);
    this.complete = false;
    this.questTemplate = questTemplate;
    _.extend(this, questTemplate)
    
    this.on('Completed',  this.onCompleted, this);
  };
  
  Quest.prototype = {
  
    start: function(entity, giverId) {
      this.entity = entity;
      this.giverid = giverId;
      this.scene = entity.scene;
      this.init(); 
      this.hookEntityEvents();
    },    
    
    onCompleted: function() {
      this.complete = true;
      this.unhookEntityEvents();
    },
    
    madeFromTemplate: function(template) {
      return this.questTemplate === template;
    }, 
        
    hookEntityEvents: function() {
      this.entity.autoHook(this);
    },
    
    unhookEntityEvents: function() {
      this.entity.autoUnhook(this);
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
    },
    
    _setQuestData: function(data) {
      this.complete = data.complete;
      this.giverid = data.giverid;
      this._in(data);
    },
    
    _getQuestData: function(data) {
      data.complete = this.complete;
      data.meta = this.meta;
      data.giverid = this.giverid;
      this._out(data);
    }
  };
  
  _.extend(Quest.prototype, Eventable.prototype);
  
  return Quest;
});
