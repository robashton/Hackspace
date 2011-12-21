define(function(require) {

  var Renderable = function(model) {
    var self = this;
    var scene = null;
    var instance = null;
    
    self["size-changed"] = function(data) {
      instance.scale(data.x, data.y, data.z);
    };
    
    self["position-changed"] = function(data) {
      instance.translate(data.x, data.y, data.z);
    };
    
    self["added-to-scene"] = function(scene) {
      scene = scene;
    };
    
    self["removed-from-scene"] = function(scene) {
      
    };
  };

});
