define(function(require) {

  var Material = require('../../render/material');
  var Quad = require('../../render/quad');
  var Instance = require('../../render/instance');
  var RenderGraph = require('../../render/rendergraph');
  var CanvasRender = require('../../render/canvasrender');
  var PackagedResources = require('../../resources/packagedresources');
  var Camera = require('../../scene/camera');
  
  var resources = new PackagedResources();
  resources.on('loaded', function() {    

    var material = new Material();
    material.diffuseTexture = resources.get('/main/helloworld.png');
    var quad = new Quad(material);
    
    var instance = new Instance(quad);
    instance.scale(100, 100);
    instance.translate(50, 50);
    
    var camera = new Camera(4.0 / 3.0, Math.PI / 4.0);
    
    var graph = new RenderGraph();
    camera.updateViewport(graph);
    
    graph.add(instance);
    
    var context = document.getElementById('target').getContext('2d');  
    var canvas = new CanvasRender(context);
    canvas.draw(graph);
  }); 
  
  
  resources.loadPackage('game/assets.json');
});
