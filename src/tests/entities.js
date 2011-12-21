define(function(require) {
  var when = require('when').when;
  var Entity = require('../scene/entity');
  
  var TestComponent = function() {
    this.events = [];
    this.commands = [];
    
    this.onEventRaised = function(msg) {
      this.events.push(msg);
    };
    this.doSomething = function(msg) {
      this.commands.push(msg);
    };
  };
  
  when("An entity has a component attached to it", function(then) {
    var entity = new Entity('test');
    var component = new TestComponent();
    entity.attach(component);
    
    entity.raise('EventRaised', 'event');
    entity.dispatch('Something', 'command');
    
    then("Events raised by the entity should propogate to the component", component.events[0] === 'event');
    then("Commands sent to the entity should be proxied to the component", component.commands[0] === 'command');
  });

});
