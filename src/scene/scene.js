define(function(require) {

  var Scene = function(context, camera) {
    this.entities = [];
    this.context = context;
    this.camera = camera;
  };
  
  Scene.prototype = {
    tick: function() {
      _(this.entities).each(function(entity){
        if(entity.tick) 
          entity.tick();
      });
    },
    render: function() {
    
    }
  };
  
});
