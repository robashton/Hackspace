define(function(require) {

  var vec3 = require('glmatrix').vec3;

  var Directable = function(startx, starty, minx, miny, maxx, maxy) {
    this.startx = startx;
    this.starty = starty;
    this.minx = minx;
    this.miny = miny;
    this.maxx = maxx;
    this.maxy = maxy;
  };
  
  Directable.prototype = {    
    createNewDestination: function() {
      this.parent.dispatch('updateDestination', [ 
        Math.random() * (this.maxx - this.minx) + this.minx + this.startx, 
        Math.random() * (this.maxy - this.miny) + this.miny + this.starty, 
        0]);
    },
    onDestinationReached: function() {
      this.createNewDestination();
    },
    onAddedToScene: function() {
      this.createNewDestination();
    }
  };  
  
  return Directable;
  
});
