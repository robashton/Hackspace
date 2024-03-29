define(function(require) {

  var CanvasRender = require('../render/canvasrender');
  var PackagedResources = require('../resources/packagedresources');
  var Package = require('../resources/package');
  var Camera = require('../scene/camera');
  var Scene = require('../scene/scene');
  var Map = require('../static/map');
  var Coords = require('../shared/coords');
  var EntityFactory = require('../entities/entityfactory');
  var RenderSettings = require('../config/rendering');
  var Shader = require('../render/shader');

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
    this.element = element;
    this.wrappedElement = $(this.element); 
    this.context = element.getContext('experimental-webgl');
    this.context.width = this.element.width;
    this.context.height = this.element.height;
    this.resources = new PackagedResources(this.context, function() { return new Package(); });
    this.app = app;
    this.resources.on('loaded', this.onResourcesLoaded, this); 
    this.resources.loadPackage('game/assets.json');
    this.entityFactory = new EntityFactory();
    this.renderSettings = new RenderSettings(this.wrappedElement);
  };
  
  Context.prototype = {    
  
    pageCoordsToWorldCoords: function(x, y) {
      var viewport = this.scene.graph.viewport;
      var scale = this.getScaleComponent();

      x /= scale.x;
      y /= scale.y;

      x += (viewport.left);
      y += (viewport.top);

      return  Coords.isometricToWorld(x,y);
    },

    worldCoordsToPageCoords: function(x, y) {
      var viewport = this.scene.graph.viewport;
      var scale = this.getScaleComponent();

      var screen = Coords.worldToIsometric(x, y);

      screen.x -= (viewport.left);
      screen.y -= (viewport.top);

      screen.x *= scale.x;
      screen.y *= scale.y;

      return screen;
    },
    worldScaleToPage: function(width, height) {
      var scale = this.getScaleComponent();
      return {
        width: width *= scale.x,
        height: height *= scale.y
      };
    },
    getScaleComponent: function() {
      var viewport = this.scene.graph.viewport;

      var canvasWidth = this.renderSettings.scaledCanvasWidth();
      var canvasHeight = this.renderSettings.scaledCanvasHeight();

      var scalex = canvasWidth / (viewport.right - viewport.left);
      var scaley = canvasHeight / (viewport.bottom - viewport.top);

      return {
        x: scalex,
        y: scaley
      };
    },

    onResourcesLoaded: function() { 
      var self = this;

      var shader = this.resources.getData('main/gl/default.shader');
      var fragment = this.resources.getData('main/gl/default.fragment');
      var defaultShader = new Shader(this.context, shader, fragment);

      this.renderer = new CanvasRender(this.context, defaultShader);
      this.camera = new Camera(this.renderSettings, 4.0 / 3.0, Math.PI / 4.0);  
      this.scene = new Scene(this.resources, this.camera, this.renderer);
      
      this.app.start(this);
      
      setInterval(function() {    
        self.scene.tick();
      }, 1000 / 30);
      
      setInterval(function() {
        self.scene.render();
      }, 1000 / 30);
           
    },
    createEntity: function(type, id, data) {
      return this.entityFactory.createEntity(type, id, data);
    }
  };
  
  return Context;
});
