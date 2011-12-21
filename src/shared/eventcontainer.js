define(function(require) {
  var _ = require('underscore');

  var EventContainer = function() {
    this.handlers = [];
  }; 
  
  EventContainer.prototype = {
    raise: function(source, data) {
     for(var i = 0; i < this.handlers.length; i++)
        this.handlers[i].call(source, data);
    },
    add: function(handler) {
      this.handlers.push(handler);
    },
    remove: function(handler) {
      this.handlers = _(this.handlers).without(handler);
    }
  };
  
  return EventContainer;
});
