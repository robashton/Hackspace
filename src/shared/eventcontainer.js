define(function(require) {
  var _ = require('underscore');

  var EventContainer = function() {
    this.handlers = [];
  }; 
  
  EventContainer.prototype = {
    raise: function(source, data) {
     for(var i = 0; i < this.handlers.length; i++) {
        var handler = this.handlers[i];
        handler.method.call(handler.context, data, source);   
     }
    },
    add: function(method, context) {
      this.handlers.push({
        method: method,
        context: context      
      });
    },
    remove: function(method, context) {
      this.handlers = _(this.handlers).filter(function(item) {
        return item.method !== method || item.context !== context;
      });
    }
  };
  
  return EventContainer;
});
