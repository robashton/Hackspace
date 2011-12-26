define(function(require) {

  var _ = require('underscore');
  var RenderGraph = require('../render/rendergraph');

  var Scene = function(renderer, camera) {
    this.entities = [];
    this.camera = camera;
    this.renderer = renderer;
    this.graph = new RenderGraph();
  };
  
  Scene.prototype = {
    tick: function() {
      _(this.entities).each(function(entity){
        if(entity.tick) 
          entity.tick();
      });
    },
    render: function() {
      this.camera.updateViewport(this.graph);
      this.renderer.clear();
      this.renderer.draw(this.graph);
    },
    add: function(entity) {
      this.entities.push(entity);
      entity.setScene(this);
    },
    remove: function(entity) {
      this.entities = _(this.entities).without(entity);
      entity.setScene(null);
    },
    broadcast: function(event, data) {
      console.log({
        event: event,
        data: data
      });
    }
  };
  
  return Scene;
  
});
