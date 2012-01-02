define(function(require) {
  
  var _ = require('underscore');
  var Entity = require('../scene/entity');

  var Grid = function(scenery) {
    Entity.call(this);
    
    this.scenery = scenery;
    this.on('AddedToScene', this.addGridRenderable);
  };
  
  Grid.prototype = {
    addGridRenderable: function(scene) {
      this.scene = scene;
      this.scene.graph.add(this);
    },
    visible: function() {
      return true;
    },
    render: function(context) {
      context.save(); 
      
      context.strokeStyle = 'rgba(25, 25, 25, 0.5)';
      context.lineWidth = 0.25;
          
      context.beginPath();
      this.scenery.forEachVisibleTile(function(left, top, right, bottom) {
        context.moveTo(left, top);
        context.lineTo(right, top);
        context.lineTo(right, bottom);
        context.lineTo(left, bottom);
        context.lineTo(left, top);
      });
      context.stroke();
      context.restore();
    }
  };
  
  _.extend(Grid.prototype, Entity.prototype);
  
  return Grid;

});
