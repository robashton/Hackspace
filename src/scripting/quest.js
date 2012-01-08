define(function() {

  var _ = require('underscore');

  var Quest = function(questTemplate) {
    this.questTemplate = questTemplate;
  };
  
  Quest.prototype = {
    start: function(entity) {
      this.entity = entity;
      this.hookEntityEvents();
      this.questTemplate.start.call(this);
    },
    stop: function() {
     for(var key in this.questTemplate) { 
        if(key.indexOf('on') === 0) {
          this.entity.off(key.substr(2), this.questTemplate[key], this);
        }   
      }
    },
    hookEntityEvents: function() {
      for(var key in this.questTemplate) { 
        if(key.indexOf('on') === 0) {
          this.entity.on(key.substr(2), this.questTemplate[key], this);
        }   
      }
    }
  };
  
  return Quest;
});
