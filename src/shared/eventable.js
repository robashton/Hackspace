define(function(require) {
  var EventContainer = require('./eventcontainer');
  
  var Eventable = function() {
    this.eventListeners = {};
    this.allContainer = new EventContainer();
  };
  
  Eventable.prototype = {
    on: function(eventName, context, callback) {
      this.eventContainerFor(eventName).add(context, callback);
    },
    
    off: function(eventName, context, callback) {
      this.eventContainerFor(eventName).remove(context, callback);
    },

    onAny: function(context, callback) {
      this.allContainer.add(context, callback);
    },

    raise: function(eventName, data) {
      var container = this.eventListeners[eventName];

      if(container)
        container.raise(this, data);

      this.allContainer.raise(this, {
        event: eventName,
        data: data
      });
    },

    eventContainerFor: function(eventName) {
      var container = this.eventListeners[eventName];
      if(!container) {
        container =  new EventContainer();
        this.eventListeners[eventName] = container;
      }
      return container;
    }
  };
  
  return Eventable;

});
