define(function(require) {

  var Tangible = function() {
  
    var self = this
    ,   position: vec3.size([0,0,0])
    ,   size = vec3.create([0,0,0])
    ;
    
    self.moveTo = function(x, y, z) {
      self.raise('position-changed', {
        x: x || 0,
        y: y || 0,
        z: z || 0
      });
    };
    
    self.scaleTo = function(x, y, z) {
      self.raise('size-changed', {
        x: x || 0.0,
        y: y || 0.0,
        z: z || 0.0
      });
    };
    
    self["position-changed"] = function(x, y, z) {
      position[0] = x;
      position[1] = y;
      position[2] = z;
    };    
    
   self["size-changed"] = function(x, y, z) {
      size[0] = x;
      size[1] = y;
      size[2] = z;
    };    
  };

});
