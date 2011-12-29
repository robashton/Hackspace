define(function(require) {
  var vec3 = require('glmatrix').vec3;

  var Instance = function(model) {
    this.model = model;
    this.position = vec3.create([0,0,0]);
    this.size = vec3.create([0,0,0]);
  };
  
  Instance.prototype = {
    visible: function(viewport) {
      return true;
    },
    scale: function(x, y, z) {
      this.size[0] = x || 0;
      this.size[1] = y || 0;
      this.size[2] = z || 0;
    },
    translate: function(x, y, z) {
      this.position[0] = x || 0;
      this.position[1] = y || 0;
      this.position[2] = z || 0;
    },
    render: function(context) {     
      this.model.upload(context);
      this.model.render(context, this);
    }
  };
  
  return Instance;
});
