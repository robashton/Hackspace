define(function(require) {

  var CanvasRender = require('../render/canvasrender');
  var PackagedResources = require('../resources/packagedresources'); 
  var Camera = require('../scene/camera');
  var Scene = require('../scene/scene');
  var Map = require('../static/map');
  var Coords = require('../shared/coords');
  
  var findRequestAnimationFrame = function() {
    return window.requestAnimationFrame        || 
      window.webkitRequestAnimationFrame  || 
      window.mozRequestAnimationFrame     || 
      window.oRequestAnimationFrame       || 
      window.msRequestAnimationFrame      ||
      function(callback, element){
        window.setTimeout(callback, 1000 / 30);
      };
  };  

  var Context = function(element, app) {
    this.resources = new PackagedResources();
    this.element = element;
    this.wrappedElement = $(this.element); 
    this.context = element.getContext('2d');
    this.app = app;
    this.resources.on('loaded', this.onResourcesLoaded, this); 
    this.resources.loadPackage('game/assets.json');
  };
  
  Context.prototype = {    
  
    pageCoordsToWorldCoords: function(x, y) {    
      var viewport = this.scene.graph.viewport;
      
      var canvasWidth = this.element.width;
      var canvasHeight = this.element.height;
           
      var scalex = canvasWidth / (viewport.right - viewport.left);
      var scaley = canvasHeight / (viewport.bottom - viewport.top);
     
      x /= scalex;
      y /= scaley;    
      
      x += (viewport.left);
      y += (viewport.top); 
            
      return  Coords.isometricToWorld(x,y);   
    },
    onResourcesLoaded: function() { 
      var self = this;
      this.renderer = new CanvasRender(this.context);
      this.camera = new Camera(4.0 / 3.0, Math.PI / 4.0);  
      this.scene = new Scene(this.resources, this.renderer, this.camera);
      
      this.app.start(this);
      
      setInterval(function() {    
        self.scene.tick();
      }, 1000 / 30);
      
      var renderAnimFrame = findRequestAnimationFrame();
      var render = function() {
        self.scene.render();
        renderAnimFrame(render);
      };      
      render();      
    }  
  };
  
  return Context;
});
