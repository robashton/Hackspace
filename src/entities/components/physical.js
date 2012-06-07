define(function(require) {

  var vec3 = require('glmatrix').vec3;
  var Coords = require('../../shared/coords');
  var Bounds = require('../../shared/bounds');

  var Physical = function() {
    this.bounds = new Bounds();
    this.scene = null;
  };
  
  Physical.prototype = {    
    onSizeChanged: function(data) {
      this.bounds.updateSize(data.x, data.y, data.z);
    },
    onPositionChanged: function(data) {
      this.bounds.updatePosition(data.x, data.y, data.z);
      this.checkLandscapeBounds();
    },
           
    onAddedToScene: function(scene) {
      this.scene = scene;
    },  
    
    onClippedTerrain: function(data) {
      this.parent.dispatch('moveTo', [
        this.bounds.position[0] + data.x,
        this.bounds.position[1] + data.y,
        this.bounds.position[2]
      ]); 
    },
    
    getCollisionFriction: function() {
      var e = { score: 0 };
      this.parent.raise('CollisionFrictionRequested', e); // TODO: Perhaps do something proper here if it's a common scenario
      return e.score;
    },
    
    collide: function(data) {
      var self = this;
      this.scene.withEntity(data.collidedEntityId, function(other) {
        var x = data.x;
        var y = data.y;
      
        var otherScore = other.get('CollisionFriction');
        var thisScore = self.getCollisionFriction();
        
        if(otherScore < thisScore) return;
        
        if(otherScore === thisScore) {
          x /= 2.0;
          y /= 2.0;
        };
        
        self.parent.dispatch('moveTo', [
          self.bounds.position[0] + x,
          self.bounds.position[1] + y,
          self.bounds.position[2]
        ]);                             
      });
      this.parent.raise('Collided', data);
    },
    
    checkLandscapeBounds: function() {
      if(!this.scene) return;
      var self = this;
      this.scene.withEntity('map', function(map) {
        self.collideWithMap(map);
      });      
    },
    getBounds: function() {
      return this.bounds.getCollisionQuad();
    },
    collideWithMap: function(map) {     
      var result = {
        x: 0,
        y: 0,
        collided: false
      };
      if(!this.collideWithTop(map, result))
        this.collideWithBottom(map, result);
      if(!this.collideWithRight(map, result))
        this.collideWithLeft(map, result);   
      
      if(result.collided) {
        this.parent.raise('ClippedTerrain', result);   
      }    
    },
    collideWithTop: function(map, result) {
      var x = result.x + this.bounds.position[0] + (this.bounds.size[0] / 2.0);
      var y = result.y + this.bounds.position[1];
      var d = 0;
      while(map.solidAt(x, y + d)) {
        d++;
        result.collided = true;
      }
      result.y += d;
      return d !== 0;
    },
    collideWithRight: function(map, result) {
      var x = result.x + this.bounds.position[0] + this.bounds.size[0];
      var y = result.y + this.bounds.position[1] + (this.bounds.size[1] / 2.0);
      var d = 0;
      while(map.solidAt(x + d, y)) {
        d--;
        result.collided = true;
      }
      result.x += d;
      return d !== 0;
    },
    collideWithBottom: function(map, result) {
      var x = result.x + this.bounds.position[0] + (this.bounds.size[0] / 2.0);
      var y = result.y + this.bounds.position[1] + this.bounds.size[1];
      var d = 0;
      while(map.solidAt(x, y + d)) {
        d--;
        result.collided = true;
      }
      result.y += d;
      return d !== 0;
    },
    collideWithLeft: function(map, result) {
      var x = result.x + this.bounds.position[0];
      var y = result.y + this.bounds.position[1] + (this.bounds.size[1] / 2.0);
      var d = 0;
      while(map.solidAt(x + d, y)) {
        d++;
        result.collided = true;
      }
      result.x += d;
      return d !== 0;
    }    
  };  
  
  return Physical;
  
});
