define(function(require) {

  var Instance = require('../../render/instance');
  var Material = require('../../render/material');
  var Quad = require('../../render/quad');
  var ExtraMath = require('../../shared/extramath');
  
  var Renderable = function(textureName, canRotate) {
    this.scene = null;
    this.instance = null;
    this.textureName = textureName;
    this.material = null;
    this.model = null;
    this.canRotate = canRotate;
  };
  
  Renderable.prototype = {    
    onSizeChanged: function(data) {
      this.instance.scale(data.x, data.x, data.y);
    },    
    
    onPositionChanged: function(data) {
      this.instance.translate(data.x, data.y, data.z);
    },
    onRotationChanged: function(data) {
      if(this.canRotate)
        this.determineTextureFromRotation(data.x);
    },
       
    onAddedToScene: function(scene) {
      this.scene = scene;
      this.createModel();
    },    
    
    createModel: function() {
      this.material = new Material();     
      this.model = new Quad(this.material);
      this.instance = new Instance(this.model);
      this.scene.graph.add(this.instance);
      if(this.canRotate)
        this.determineTextureFromRotation(Math.PI);
      else
        this.determineFixedTexture();
    },
    
    determineFixedTexture: function() {
      this.material.diffuseTexture = this.scene.resources.get('/main/' + this.textureName + '.png');
    },
    
    determineTextureFromRotation: function(rotation) {
      var textureSuffix = 'up';
      rotation = ExtraMath.clampRotation(rotation);
      
      // Account for the isometric PoV
      rotation += Math.PI / 4.0;
      
      if(rotation < Math.PI * 0.12)
        textureSuffix = 'up';
      else if(rotation < Math.PI * 0.37)
        textureSuffix = 'up-right';
      else if(rotation < Math.PI * 0.62)
        textureSuffix = 'right';
      else if(rotation < Math.PI * 0.87)
        textureSuffix = 'down-right';
      else if(rotation < Math.PI * 1.12)
        textureSuffix = 'down';
      else if(rotation < Math.PI * 1.37)
        textureSuffix = 'down-left';
      else if(rotation < Math.PI * 1.62)
        textureSuffix = 'left';
      else if(rotation < Math.PI * 1.87)
        textureSuffix = 'up-left';      
      
      this.material.diffuseTexture = this.scene.resources.get('/main/' + this.textureName + '-' + textureSuffix + '.png');
    },
    
    onRemovedFromScene: function() {
      this.scene.graph.remove(this.instance);
    }
  };  
  
  return Renderable;
  
});
