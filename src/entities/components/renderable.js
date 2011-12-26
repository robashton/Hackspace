define(function(require) {

  var Instance = require('../../render/instance');

  var Renderable = function(model) {
    this.scene = null;
    this.instance = null;
    this.model = model;
  };
  
  Renderable.prototype = {    
    onSizeChanged: function(data) {
      this.instance.scale(data.x, data.y, data.z);
    },    
    
    onPositionChanged: function(data) {
      this.instance.translate(data.x, data.y, data.z);
    },    
       
    onAddedToScene: function(scene) {
      this.scene = scene;
      this.instance = new Instance(this.model);
      this.scene.graph.add(this.instance);
    },    
    
    onRemovedFromScene: function() {
      this.scene.graph.remove(this.instance);
    }
  };  
  
  return Renderable;
  
});
