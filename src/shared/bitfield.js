define(function(require) {

  var BitField = function(size) {
    this.values = new Array((size / 32) | 0);
  };

  BitField.prototype = {
    get: function(i) {
      var index = (i / 32) | 0;
      var bit = i % 32;
      return (this.values[index] & (1 << bit)) !== 0;
    },

    set: function(i) {
      var index = (i / 32) | 0;
      var bit = i % 32;
      this.values[index] |= 1 << bit;
    },
    unset: function(i) {
      var index = (i / 32) | 0;
      var bit = i % 32;
      this.values[index] &= ~(1 << bit);
    },
    zero: function() {
      for(var i = 0; i < this.values.length; i++)
        this.values[i] = 0;
    }
  };
  
  return BitField;
});
