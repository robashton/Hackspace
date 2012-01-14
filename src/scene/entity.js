define(function(require) {

  var ComponentBag = require('./componentbag');
  var _ = require('underscore');

  var Entity = function(id) {
    ComponentBag.call(this);    
    this.id = id;
    
    this.onAny(this.propogateEventToScene);
  };
  
  Entity.prototype = {
    setScene: function(scene) {
      this.scene = scene;
      if(scene)
        this.raise('AddedToScene', scene);
      else
        this.raise('RemovedFromScene');
    },
    tick: function() {
      this.raise('Tick');
    },
    propogateEventToScene: function(data) {
      if(this.scene)
        this.scene.broadcast(data.event, data.data, this);
    },
  };
  _.extend(Entity.prototype, ComponentBag.prototype);
 
  return Entity;
  
});
