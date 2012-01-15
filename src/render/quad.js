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
      var bottomLeft = Coords.worldToIsometric(instance.position[0], instance.position[1] + instance.size[1]);
      
      var width = instance.size[0] + instance.size[1];
      var height = instance.size[2];
      
      canvas.drawImage(
        this.image('diffuseTexture'),
        bottomLeft.x,
        bottomLeft.y - height,
        width,
        height);
        
      this.drawFloor(canvas, instance);
    },
    drawPlainQuad: function(canvas, instance) {
      var bottomLeft = Coords.worldToIsometric(instance.position[0], instance.position[1] + instance.size[1]);
      
      var width = instance.size[0] + instance.size[1];
      var height = instance.size[2];
          
      canvas.fillRect(
        bottomLeft.x,
        bottomLeft.y - height,
        width,
        height);
    },
    image: function(name) {
       return this.material[name].get()
    },
    drawFloor: function(canvas, instance) {
      var topLeft = Coords.worldToIsometric(instance.position[0], instance.position[1]);
      var topRight = Coords.worldToIsometric(instance.position[0] + instance.size[0], instance.position[1]);
      var bottomRight = Coords.worldToIsometric(instance.position[0] + instance.size[0], instance.position[1] + instance.size[1]);
      var bottomLeft = Coords.worldToIsometric(instance.position[0], instance.position[1] + instance.size[1]);
      
      canvas.strokeStyle = 'rgba(100, 100, 100, 0.5)';
      canvas.lineWidth = 0.25;
      canvas.beginPath();
      canvas.moveTo(topLeft.x, topLeft.y);
      canvas.lineTo(topRight.x, topRight.y);
      canvas.lineTo(bottomRight.x, bottomRight.y);
      canvas.lineTo(bottomLeft.x, bottomLeft.y);
      canvas.lineTo(topLeft.x, topLeft.y);
      canvas.stroke();
    }
  }; 
  
  return Quad;
});
