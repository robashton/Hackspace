define(function(require) {

  var Material = require('../../render/material');
  var Quad = require('../../render/quad');
  var Instance = require('../../render/instance');
  var RenderGraph = require('../../render/rendergraph');
  var CanvasRender = require('../../render/canvasrender');
  var PackagedResources = require('../../resources/packagedresources');
  var Camera = require('../../scene/camera');
  var Character = require('../../entities/character');
  var Scene = require('../../scene/scene');
  var InputEmitter = require('../../input/inputemitter');
  var Controller = require('../../entities/controller');
  var Scenery = require('../../static/scenery');
  
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

  
  var resources = new PackagedResources();
  resources.on('loaded', function() {    
    
    var material = new Material();
    material.diffuseTexture =  resources.get('/main/testtile.png');
    var quad = new Quad(material);
    
    var character = new Character("player", 0, 0, 25, 25, quad);
    var controller = new Controller();
    var scenery = new Scenery(640, 480);
    
    var canvasElement = document.getElementById('target');
    canvasElement.width = 640;
    canvasElement.height = 480;
    var mainContext = canvasElement.getContext('2d');     
    
    var renderer = new CanvasRender(mainContext);
    var camera = new Camera(4.0 / 3.0, Math.PI / 4.0);  
    var scene = new Scene(resources, renderer, camera);
    
    scene.add(scenery);
    scene.add(character);
    scene.add(controller);
    
    setInterval(function() {    
      scene.tick();
    }, 1000 / 30);
    
    var renderAnimFrame = findRequestAnimationFrame();
    var render = function() {
      scene.render();
      renderAnimFrame(render);
    };
    
    render();
    
   
    
    
    var input = new InputEmitter(scene, canvasElement);
    
    
    
  }); 
  
  
  resources.loadPackage('game/assets.json');
});
