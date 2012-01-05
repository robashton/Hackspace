define(function(require) {

  var _ = require('underscore');
  var RenderGraph = require('../render/rendergraph');
  var Eventable = require('../shared/eventable');
  
  var Scene = function(resources, renderer, camera) {
    Eventable.call(this);
    this.entities = [];
    this.entitiesById = {};
    this.camera = camera;
    this.renderer = renderer;
    this.graph = new RenderGraph();
    this.resources = resources;
  };
  
  Scene.prototype = {
    tick: function() {
      _(this.entities).each(function(entity){
        if(entity.tick) 
          entity.tick();
      });
    },
    withEntity: function(id, callback) {
      var entity = this.entitiesById[id];
      if(entity) callback(entity);
    },
    render: function() {
      this.camera.updateViewport(this.graph);
      this.renderer.clear();
      this.renderer.draw(this.graph);
    },
    add: function(entity) {
      this.entities.push(entity);
      this.entitiesById[entity.id] = entity;
      entity.setScene(this);
    },
    remove: function(entity) {
      this.entities = _(this.entities).without(entity);
      delete this.entities[entity.id];
      entity.setScene(null);
    },
    dispatch: function(id, command, data) {
      var entity = this.entitiesById[id];
      entity.dispatch(command, data);
    },
    broadcast: function(event, data) {
      this.raise(event, data);
    }
  };
  _.extend(Scene.prototype, Eventable.prototype);
  
  return Scene;  
});
