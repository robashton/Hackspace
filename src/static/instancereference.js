define(function(require) {

  var InstanceReference = function(parent, instance, tile) {
    this.instance = instance;
    this.tile = tile;
  };
  
  InstanceReference.prototype = {
    delete: function() {
     parent.deleteInstance(this.tile, this.instance);
    }
  };
  
  return InstanceReference;

});
