define(function(require) {

  var Eventable = require('../shared/eventable');
  var _ = require('underscore');

  var Entity = function(id) {
    Eventable.call(this);
    this.id = id;
    this.components = [];
    this.eventHandlers = {};
    this.commandHandlers = {};
  };
  
  Entity.prototype = {
    attach: function(component) {
      this.components.push(component);
      this.registerHandlers(component);
    },
    
    registerHandlers: function(component) {
      for(var key in component) {
        var item = component[key];
        if(item.call)
          this.tryRegisterHandler(component, key, item);
      }
    },
    
    tryRegisterHandler: function(component, key, handler) {
      if(key.indexOf('on') === 0)
        this.registerEventHandler(component, key, handler);
      else if(key.indexOf('do') === 0)
        this.registerCommandHandler(component, key, handler);
    },
    
    registerEventHandler: function(component, key, handler) {
      this.on(key.substr(2), component, handler);
    },
    
    registerCommandHandler: function(component, key, handler) {      
      this.commandHandlers[key.substr(2)] = {
        component: component,
        method: handler
      };
    },
        
    dispatch: function(command, data) {
      var handler = this.findCommandHandler(command);
      handler.method.call(handler.component, data); 
    },
    
    findCommandHandler: function(key) {
      return this.commandHandlers[key];
    }
  };
  _.extend(Entity.prototype, Eventable.prototype); 
 
  return Entity;
  
});
