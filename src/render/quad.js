define(function(require) {

  var Coords = require('../shared/coords');

  var Quad = function(material) {
    this.material = material;
  };
  
  Quad.prototype = {
    upload: function(context) {
    //  this.material.upload(context);
    },
    render: function(canvas, instance) {
      if(this.material.diffuseTexture)
        this.drawTexturedQuad(canvas, instance);
      else
        this.drawPlainQuad(canvas, instance);      
    },
    drawTexturedQuad: function(canvas, instance) {
      var transform = Coords.worldToIsometric(instance.position[0], instance.position[1]);
      canvas.drawImage(
        this.image('diffuseTexture'),
        transform.x,
        transform.y,
        instance.size[0],
        instance.size[1]);
    },
    drawPlainQuad: function(canvas, instance) {
       var transform = Coords.worldToIsometric(instance.position[0], instance.position[1]);
          
      canvas.fillRect(
        transform.x,
        transform.y,
        instance.size[0],
        instance.size[1]);
    },
    image: function(name) {
       return this.material[name].get()
    }
  }; 
  
  return Quad;
});
