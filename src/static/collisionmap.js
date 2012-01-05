define(function(require) {

  var BitField = require('../shared/bitfield');

  var CollisionMap = function(data) {
    this.bitfield = new BitField();
    this.width = data.width;
    this.height = data.height;
    this.bitfield.values = data.collision;  
  };
  
  CollisionMap.prototype = {
    solidAt: function(x, y) {
      var index = x + y * this.width;
      return this.bitfield.get(index);
    }
  };
  
  return CollisionMap;
});
