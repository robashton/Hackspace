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
      var middlex = instance.position[0] + (instance.size[0] / 2.0);
      var middley = instance.position[1] + (instance.size[1] / 2.0);

      canvas.save();
      canvas.translate(middlex, middley);
      canvas.rotate(instance.rotation);
    
      canvas.drawImage(
        this.image('diffuseTexture'),
        0 - (instance.size[0] / 2.0),
        0 - (instance.size[1] / 2.0),
        instance.size[0],
        instance.size[1]);
        
      canvas.restore();
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
