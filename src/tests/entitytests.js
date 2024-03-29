define(function(require) {
  var when = require('when').when;
  var Entity = require('../scene/entity');
  
  var TestComponent = function() {
    this.events = [];
    this.commands = [];   
  };
  TestComponent.prototype = {
    onEventRaised: function(msg) {
      this.events.push(msg);
    },
    doSomething: function(msg) {
      this.commands.push(msg);
    }
  };
  
  when("An entity has a component attached to it", function(then) {
    var entity = new Entity('test');
    var component = new TestComponent();
    entity.attach(component);
    
    entity.raise('EventRaised', 'event');
    entity.dispatch('doSomething', ['command']);
    
    then("Events raised by the entity should propogate to the component", component.events[0] === 'event');
    then("Commands sent to the entity should be proxied to the component", component.commands[0] === 'command');
    then("The component is given a reference to the entity", component.parent === entity);
  });
  
  when("An command causes another command to be dispatched to the same entity", function(then) {
    var entity = new Entity('test');
    var eventHandleCount = 0;
    entity.attach({
      firstCommand: function() {
        this.parent.raise('FirstCommand');
      },
      secondCommand: function() {
        then("The command is not dispatched until current command is fully handled", eventHandleCount == 2);
      },
      onFirstCommand: function() {
        this.parent.dispatch('secondCommand');
        eventHandleCount++;
      }
    });
    entity.attach({
      onFirstCommand: function() {
        eventHandleCount++;
      }
    }); 
    entity.dispatch('firstCommand');
  });
  

});
