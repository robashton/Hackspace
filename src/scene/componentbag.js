define(function(require) {
  var _ = require('underscore');
  var Eventable = require('../shared/eventable');
  
  var ComponentBag = function() {
    Eventable.call(this);
   
    this.components = [];
    this.eventHandlers = {};
    this.commandHandlers = {};
  };
  
  ComponentBag.prototype = {
     
    attach: function(component) {
      this.components.push(component);
      this.registerHandlers(component);
      component.parent = this;
    },
    
    registerHandlers: function(component) {
      for(var key in component) {
        var item = component[key];
        if(item && item.call)
          this.tryRegisterHandler(component, key, item);
      }
    },
    
    tryRegisterHandler: function(component, key, handler) {
      if(key.indexOf('on') === 0)
        this.registerEventHandler(component, key, handler);
      else
        this.registerCommandHandler(component, key, handler);
    },
    
    registerEventHandler: function(component, key, handler) {
      this.on(key.substr(2), handler, component);
    },
    
    registerCommandHandler: function(component, key, handler) {      
      this.commandHandlers[key] = {
        component: component,
        method: handler
      };
    },
        
    dispatch: function(command, data) {
      var handler = this.findCommandHandler(command);
      if(!handler) throw "Could not find handler for command '" + command + "' on entity " + this.id;
      handler.method.apply(handler.component, data); 
    },
    
    get: function(query, data, defaultValue) {
      var handler = this.findCommandHandler(query);
      if(!handler) {
         return defaultValue;
      }
      return handler.method.apply(handler.component, data); 
    },
    
    findCommandHandler: function(key) {
      return this.commandHandlers[key];
    }
  };
  _.extend(ComponentBag.prototype, Eventable.prototype);
  return ComponentBag;
});
