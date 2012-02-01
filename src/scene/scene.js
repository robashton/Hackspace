define(function(require) {

  var _ = require('underscore');
  var RenderGraph = require('../render/rendergraph');
  var Eventable = require('../shared/eventable');
  
  var Scene = function(resources, camera, renderer) {
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
      this.raise('PreTick');
      _(this.entities).each(function(entity){
        if(entity.tick) 
          entity.tick();
      });
      this.raise('PostTick');
    },
    withEntity: function(id, callback) {
      var entity = this.entitiesById[id];
      if(entity) callback(entity);
    },
    fromEntity: function(id, query, params, defaultValue) {
      var entity = this.entitiesById[id];
      if(!entity) return defaultValue;
      return entity.get(query, params, defaultValue);
    },
    each:  function(callback, context) {
      for(var i = 0 ; i < this.entities.length; i++) {
        callback.call(context || this, this.entities[i]);
      }
    },
    crossEach: function(callback, context) {
      for(var i = 0 ; i < this.entities.length; i++) {
        for(var j = (i+1) ; j < this.entities.length; j++) {
          callback.call(context || this, i, j, this.entities[i], this.entities[j]);
        }
      }
    },
    get: function(id) {
      return this.entitiesById[id];
    },
    entityAtMouse: function(x, y, filter) {
      return _(this.entities).find(function(entity){
        if(filter && !filter(entity)) return false;
        return entity.get('intersectWithMouse', [x, y], false);
      });
    },
    render: function() {
      this.raise('PreRender');
      this.camera.updateViewport(this.graph);
      this.renderer.clear();
      this.renderer.draw(this.graph);
      this.raise('PostRender');
    },
    add: function(entity) {
      if(!entity.id) throw "Attempt to add entity without id: " + entity;
      this.entities.push(entity);
      this.entitiesById[entity.id] = entity;
      entity.setScene(this);
    },
    remove: function(entity) {
      this.entities = _(this.entities).without(entity);
      delete this.entitiesById[entity.id];
      entity.setScene(null);
    },
    
    dispatchDirect: function(id, command, args) {
      var entity = this.entitiesById[id];
      entity.dispatch(command, args);
    },
    
    dispatch: function(id, command, args) {
      if(!this.renderer) { // if IsServer (TODO)         
        this.dispatchDirect(id, command, args);
        this.raise('CommandDispatched', {
          id: id, command: command, args: args
        });
      }
    },
    broadcast: function(event, data, sender) {
      this.raise(event, data, sender || this);
    }
  };
  _.extend(Scene.prototype, Eventable.prototype);
  
  return Scene;  
});
