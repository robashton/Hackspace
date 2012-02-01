define(function(require) {

  var vec3 = require('glmatrix').vec3;

  var Directable = function(startx, starty, minx, miny, maxx, maxy) {
    this.startx = startx;
    this.starty = starty;
    this.minx = minx;
    this.miny = miny;
    this.maxx = maxx;
    this.maxy = maxy;
    this.wandering = false;
    this.scene = null;
  };
  
  Directable.prototype = {    
    createNewDestination: function() {
      this.scene.dispatch(this.parent.id, 'updateDestination', [ 
        Math.random() * (this.maxx - this.minx) + this.minx + this.startx, 
        Math.random() * (this.maxy - this.miny) + this.miny + this.starty, 
        0]);
    },
    onDestinationReached: function() {
      if(this.wandering)
        this.createNewDestination();
    },
    onStateChanged: function(state) {
      if(state === 'Wandering') {
        this.wandering = true;
        this.createNewDestination();
      }
      else
        this.wandering = false;
    },
    onAddedToScene: function(scene) {
      this.scene = scene;
    }
  };  
  
  return Directable;
  
});
