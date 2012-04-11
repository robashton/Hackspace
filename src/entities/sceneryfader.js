define(function(require) {
  var _ = require('underscore');
  
  var SceneryFader = function(scene, playerId) {
    this.playerId = playerId;
    this.scene = scene;
    this.hookSceneEvents();
  };
  
  SceneryFader.prototype = {
    hookSceneEvents: function() {
      this.scene.on('PreRender', this.onScenePreRender, this);
    },
    onScenePreRender: function() {
      var self = this;
      this.scene.withEntity(this.playerId, function(entity) {
        self.scene.withEntity('map', function(map) {
          self.determineIfEntityIntersectingWithAnything(map, entity);
        });
      }); 
    },
    determineIfEntityIntersectingWithAnything: function(map, entity) {
      var self = this;
      map.forEachVisibleTile(function(tile) {
        tile.forEachInstance(function(instance, template) {
          if(template.floor) return;
          self.determineIfEntityIntersectingWithInstance(entity, instance);
        });      
      });    
    },
    determineIfEntityIntersectingWithInstance: function(entity, instance) {
      var quad = instance.getQuad();
      if(entity.get('CoversQuad', [ quad ]) && entity.get('IsBehind', [instance.depth()]) ) {
        instance.setOpacity(0.5);
      } else {
        instance.setOpacity(1.0);
      }
    }
  };
  
 
  return SceneryFader;
});
