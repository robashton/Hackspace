define(function(require) {
  var EventContainer = require('./eventcontainer');
  
  var Eventable = function() {
    this.eventListeners = {};
    this.allContainer = new EventContainer(this);
  };
  
  Eventable.prototype = {
    on: function(eventName, callback, context) {
      this.eventContainerFor(eventName).add(callback, context);
    },
    
    off: function(eventName, callback, context) {
      this.eventContainerFor(eventName).remove(callback, context);
    },

    onAny: function(callback, context) {
      this.allContainer.add(callback, context);
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
        container =  new EventContainer(this);
        this.eventListeners[eventName] = container;
      }
      return container;
    }
  };
  
  return Eventable;

});
