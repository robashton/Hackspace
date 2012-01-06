define(function(require) {

  var Coords = {
  
    worldToIsometric: function(x, y) {
   /*   return {
        x: x,
        y: y
      };*/
      return {
        x: x - y,
        y: (x + y) / 2.0
      };
    },
    
    isometricToWorld: function(x, y) {
      var ty = (((2.0 * y) - x) / 2.0);
      var tx = x + ty;
 /*     return {
        x: x,
        y: y
      };*/
      return {
        x: tx,
        y: ty
      }
    }
  };
  
  return Coords;

});
