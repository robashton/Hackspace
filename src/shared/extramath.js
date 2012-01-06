define(function(require) {

  var FullRotation = Math.PI * 2.0;
  
  var ExtraMath = {
    clampRotation: function(rotation) {
      while(rotation < 0)
        rotation += FullRotation;
      while(rotation > FullRotation)
        rotation -= FullRotation;
      return rotation;
    }   
  };
  
  return ExtraMath;

});
