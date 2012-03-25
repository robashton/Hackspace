define(function(require) {

  var BitField = require('../shared/bitfield');

  var CollisionMap = function(values, width, height) {
    this.bitfield = new BitField();
    this.width = width;
    this.height = height;
    this.bitfield.values = values;  
  };
  
  CollisionMap.prototype = {
    solidAt: function(x, y) {
      var index = x + y * this.width;
      return this.bitfield.get(index);
    }
  };
  
  return CollisionMap;
});
