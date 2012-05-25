define(function(require) {
  
  var _ = require('underscore');
  var Entity = require('../scene/entity');
  var Coords = require('../shared/coords');

  var Grid = function(map) {
    Entity.call(this);
    
    this.map = map;
    this.id = 'grid';
    this.on('AddedToScene', this.addGridRenderable);
  };
  
  Grid.prototype = {
    addGridRenderable: function(scene) {
      this.scene = scene;
      this.scene.graph.add(this);
    },
    depth: function() {
      return -1000000;
    },
    visible: function() {
      return true;
    },
    render: function(context) {
      // context.save(); 
      
      // context.strokeStyle = 'rgba(100, 100, 100, 1.0)';
      // context.lineWidth = 0.25;
          
      // context.beginPath();
      // this.map.forEachVisibleQuad(function(left, top, right, bottom) {
      
      //   var topleft = Coords.worldToIsometric(left, top);
      //   var topright = Coords.worldToIsometric(right, top);        
      //   var bottomright = Coords.worldToIsometric(right, bottom);
      //   var bottomleft = Coords.worldToIsometric(left, bottom);
         
      //   context.moveTo(topleft.x, topleft.y);
      //   context.lineTo(topright.x, topright.y);
      //   context.lineTo(bottomright.x, bottomright.y);
      //   context.lineTo(bottomleft.x, bottomleft.y);
      //   context.lineTo(topleft.x, topleft.y);
      // });
      // context.stroke();
      // context.restore();
    }
  };
  
  _.extend(Grid.prototype, Entity.prototype);
  
  return Grid;

});
