define(function(require) {

  var CanvasRender = require('../render/canvasrender');
  var PackagedResources = require('../resources/packagedresources'); 
  var Camera = require('../scene/camera');
  var Scene = require('../scene/scene');
  var Map = require('../static/map');

  
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
      var offset = this.wrappedElement.offset();
      var nx = x - offset.left;
      var ny = y - offset.top;
      return this.elementCoordsToWorldCoords(nx, ny);
    },  
    elementCoordsToWorldCoords: function(x, y) {
      var scaleX = parseInt( this.wrappedElement.width() / this.scene.graph.width());
      var scaleY = parseInt( this.wrappedElement.height() / this.scene.graph.height());
      
      return {
        x: (x * scaleX) + this.scene.graph.viewport.left,
        y: (y * scaleY) + this.scene.graph.viewport.top
      };
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
