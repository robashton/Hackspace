define(function(require) {
  var _ = require('underscore');
  var Eventable = require('../shared/eventable');
  
  var ComponentBag = function() {
    Eventable.call(this);
   
    this.components = [];
    this.eventHandlers = {};
    this.commandHandlers = {};
    this.queuedCommands = [];
    this.on('EventHandled', this.onEventHandled);
    this.currentCommandDepth = 0;
  };
  
  ComponentBag.prototype = {
     
    attach: function(component) {
      this.components.push(component);
      this.registerHandlers(component);
      component.parent = this;
    },
    
    component: function(type) {
      for(var i in this.components) {
        var component = this.components[i];
        if(component instanceof type)
          return component;      
      }
      throw "Couldn't find component";
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
    
    isCurrentlyHandlingCommand: function() {
      return this.currentCommandDepth > 0;
    },
          
    count : 0,
    dispatch: function(command, data) {
      if(command === 'startQuest') {
        console.trace('DISPATCHING COMMAND ' + command);
        if(this.count++ > 3) return;   
      }
      if(this.isCurrentlyHandlingCommand())
        this.queueCommand(command, data);
      else
        this.dispatchCommand(command, data);
    },
    
    queueCommand: function(command, data) {
      this.queuedCommands.push({command: command, data: data});
    },

    dispatchCommand: function(command, data) {
      this.currentCommandDepth++;
      var handler = this.findCommandHandler(command);
      if(!handler) throw "Could not find handler for command '" + command + "' on entity " + this.id;
      handler.method.apply(handler.component, data);
      this.currentCommandDepth--;
      if(this.currentCommandDepth === 0)
        this.pumpPendingCommands();
    },
    
    pumpPendingCommands: function() {
      if(this.queuedCommands.length > 0) {
        var item = this.queuedCommands.shift();
        this.dispatchCommand(item.command, item.data);
      }
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
    },
    _in: function(data) {
      for(var i = 0; i < this.components.length; i++)
        if(this.components[i]._in) this.components[i]._in(data);
    },
    _out: function(data) {
      for(var i = 0; i < this.components.length; i++)
        if(this.components[i]._out) this.components[i]._out(data);
    }
  };
  _.extend(ComponentBag.prototype, Eventable.prototype);
  return ComponentBag;
});
