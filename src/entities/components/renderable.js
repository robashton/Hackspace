define(function(require) {

  var Instance = require('../../render/instance');
  var Material = require('../../render/material');
  var Quad = require('../../render/quad');
  var ExtraMath = require('../../shared/extramath');
  var vec3 = require('glmatrix').vec3;
  var Coords = require('../../shared/coords');
  
  var Renderable = function(textureName, canRotate) {
    this.scene = null;
    this.instance = null;
    this.textureName = textureName;
    this.material = null;
    this.model = null;
    this.canRotate = canRotate;
    this.size = vec3.create([0,0,0]);
    this.position = vec3.create([0,0,0]);
    this.animationName = 'static';
    this.animationFrame = -1;
    this.rotation = 0;
  };
  
  Renderable.prototype = {    
    onSizeChanged: function(data) {
      this.size[0] = data.x;
      this.size[1] = data.y;
      this.size[2] = data.z;
      this.updateModel();
    },    
    
    onPositionChanged: function(data) {
      this.position[0] = data.x;
      this.position[1] = data.y;
      this.position[2] = data.z;
      this.updateModel();
    },
    onAnimationFrameChanged: function(frame) {
      this.animationFrame = frame;
      this.determineTextureFromRotation();
    },
    onAnimationChanged: function(data) {
      this.animationName = data.animation;
    },
    
    onRemovedFromScene: function() {
      this.scene.graph.remove(this.instance);
    },
    updateModel: function() {
      this.instance.scale(this.size[0], this.size[1], this.size[2]);
      this.instance.translate(this.position[0] - (this.size[0] / 2.0), 
                              this.position[1] - (this.size[1] / 2.0), 
                              this.position[2]);
    },
    onRotationChanged: function(data) {
      this.rotation = data.x;
      if(this.canRotate)
        this.determineTextureFromRotation();
    },
       
    onAddedToScene: function(scene) {
      this.scene = scene;
      this.createModel();
    }, 
    
    intersectWithMouse: function(x, y) {
      return this.instance.intersectWithWorldCoords(x, y);
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
    
    coversQuad: function(quad) {
      return this.instance.coversQuad(quad);
    },
    
    isBehind: function(depth) {
      return this.instance.depth() <= depth;
    },
    
    determineFixedTexture: function() {
      this.material.diffuseTexture = this.scene.resources.get('main/' + this.textureName + '.png');
    },
    
    determineTextureFromRotation: function(rotation) {
      var path = 'main/' + this.textureName + '/' + this.animationName + '-';
    
      var textureSuffix = 'up';
      var rotation = ExtraMath.clampRotation(this.rotation);
      
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
        
      if(this.animationFrame < 0)
        this.material.diffuseTexture = this.scene.resources.get(path + textureSuffix + '.png');
      else
        this.material.diffuseTexture = this.scene.resources.get(path + textureSuffix + '-' + this.animationFrame + '.png'); 
    }
  };  
  
  return Renderable;
  
});
