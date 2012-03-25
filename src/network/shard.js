define(function(require) {
  var _ = require('underscore');

  var Shard = function(map) {
    this.map = map;
    this.root = null;
  };
  
  Shard.prototype = {
    connect: function(root) {
      this.root = root;
      this.root.send("alive", {
        bounds: this.map.bounds()
      });
    }
  };
  
  return Shard;
});
