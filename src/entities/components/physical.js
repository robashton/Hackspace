define(function(require) {

  var vec3 = require('glmatrix').vec3;

  var Physical = function() {
    this.position = vec3.create([0,0,0]);
    this.size = vec3.create([0,0,0]);
    this.scene = null;
  };
  
  Physical.prototype = {    
    onSizeChanged: function(data) {
      this.size[0] = data.x;
      this.size[1] = data.y;
      this.size[2] = data.z;
    },  
    onPositionChanged: function(data) {
      this.position[0] = data.x;
      this.position[1] = data.y;
      this.position[2] = data.z;
      this.checkLandscapeBounds();
    },  
           
    onAddedToScene: function(scene) {
      this.scene = scene;
    },  
    
    onClippedTerrain: function(data) {
      this.parent.dispatch('moveTo', [
        this.position[0] + data.x,
        this.position[1] + data.y,
        this.position[2]
      ]); 
    },
    
    checkLandscapeBounds: function() {
      if(!this.scene) return;
      var self = this;
      this.scene.withEntity('map', function(map) {
        self.collideWithMap(map);
      });      
    },
    collideWithMap: function(map) {     
      var result = {
        x: 0,
        y: 0,
        collided: false
      };
      this.collideWithTop(map, result);
      this.collideWithRight(map, result);
      this.collideWithBottom(map, result);
      this.collideWithLeft(map, result);   
      
      if(result.collided) {
        this.parent.raise('ClippedTerrain', result);   
      }    
    },
    collideWithTop: function(map, result) {
      var x = result.x + this.position[0] + (this.size[0] / 2.0);
      var y = result.y + this.position[1];
      var d = 0;
      while(map.solidAt(x, y + d)) {
        d++;
        result.collided = true;
      }
      result.y += d;
    },
    collideWithRight: function(map, result) {
      var x = result.x +  this.position[0] + this.size[0];
      var y = result.y + this.position[1] + (this.size[1] / 2.0);
      var d = 0;
      while(map.solidAt(x + d, y)) {
        d--;
        result.collided = true;
      }
            

      result.x += d;
    },
    collideWithBottom: function(map, result) {
      var x = result.x + this.position[0] + (this.size[0] / 2.0);
      var y = result.y + this.position[1] + this.size[1];
      var d = 0;
      while(map.solidAt(x, y + d)) {
        d--;
        result.collided = true;
      }
      result.y += d;
    },
    collideWithLeft: function(map, result) {
      var x = result.x + this.position[0];
      var y = result.y + this.position[1] + (this.size[1] / 2.0);
      var d = 0;
      while(map.solidAt(x + d, y)) {
        d++;
        result.collided = true;
      }
      result.x += x;
    }    
  };  
  
  return Physical;
  
});
