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
  
  var resources = new PackagedResources();
  resources.on('loaded', function() {    
    
    var material = new Material();
    material.diffuseTexture =  resources.get('/main/testtile.png');
    var quad = new Quad(material);
    
    var character = new Character("player", 10, 10, 100, 100, quad);
  
    var canvasElement = document.getElementById('target');
    var mainContext = canvasElement.getContext('2d');     
    var renderer = new CanvasRender(mainContext);
    var camera = new Camera(4.0 / 3.0, Math.PI / 4.0);  
    var scene = new Scene(renderer, camera);
    scene.add(character);
    
    setInterval(function() {    
      scene.tick();
      scene.render();
    }, 250);
    
    var input = new InputEmitter(scene, canvasElement);
    
    
    
  }); 
  
  
  resources.loadPackage('game/assets.json');
});
