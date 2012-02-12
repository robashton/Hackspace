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
    
      if(this.material.diffuseTexture) {
        this.withAlpha(canvas, instance, this.drawTexturedQuad);
      }
      else {
        this.withAlpha(canvas, instance, this.drawPlainQuad);
      }
    },
    withAlpha: function(canvas, instance, callback) {
      if(instance.opacity !== undefined && instance.opacity < 1.0) {
        canvas.globalAlpha = instance.opacity;
        callback.call(this, canvas, instance);
        canvas.globalAlpha = 1.0;
      } else {
        callback.call(this, canvas, instance);
      }
    },
    drawTexturedQuad: function(canvas, instance) {  
      var dim = instance.getQuad();      
      canvas.drawImage(
        this.image('diffuseTexture'),
        dim.x,
        dim.y,
        dim.width,
        dim.height);
        
   //   this.drawFloor(canvas, instance);
    },
    drawPlainQuad: function(canvas, instance) {
      var dim = instance.getQuad();          
      canvas.fillRect(
        dim.x,
        dim.y,
        dim.width,
        dim.height);
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
