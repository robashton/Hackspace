define(function(require) {

  var Eventable = require('../shared/eventable');

  var Entity = function(id) {
    this.id = id;
    this.components = [];
  };
  
  Entity.prototype = {
    attach: function(component) {
      component.call(this);
    };
  };
  
  Eventable.call(Entity.prototype);
});
