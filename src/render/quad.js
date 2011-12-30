define(function(require) {

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
      canvas.drawImage(
        this.image('diffuseTexture'),
        parseInt(instance.position[0]),
        parseInt(instance.position[1]),
        parseInt(instance.size[0]),
        parseInt(instance.size[1]));
    },
    drawPlainQuad: function(canvas, instance) {
      canvas.fillRect(
        instance.position[0],
        instance.position[1],
        instance.size[0],
        instance.size[1]);
    },
    image: function(name) {
       return this.material[name].get()
    }
  }; 
  
  return Quad;
});
