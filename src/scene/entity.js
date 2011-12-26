define(function(require) {

  var ComponentBag = require('./componentbag');
  var _ = require('underscore');

  var Entity = function(id) {
    ComponentBag.call(this);    
    this.id = id;
  };
  
  Entity.prototype = {
     setScene: function(scene) {
      this.scene = scene;
      if(scene)
        this.raise('AddedToScene', scene);
      else
        this.raise('RemovedFromScene');
     }
  };
  _.extend(Entity.prototype, ComponentBag.prototype);
 
  return Entity;
  
});
