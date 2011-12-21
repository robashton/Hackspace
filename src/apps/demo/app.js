define(function(require) {

  var Material = require('../../render/material');
  var Quad = require('../../render/quad');
  var Instance = require('../../render/instance');
  var RenderGraph = require('../../render/rendergraph');
  var CanvasRender = require('../../render/canvasrender');
  var PackagedResources = require('../../resources/packagedresources');
  
  var resources = new PackagedResources();
  resources.on('loaded', function() {    

    var material = new Material();
    material.diffuseTexture = resources.get('/main/helloworld.png');
    var quad = new Quad(material);
    
    var instance = new Instance(quad);
    instance.scale(10, 10);
    instance.translate(10, 10);
    
    var graph = new RenderGraph();
    graph.updateViewport(0, 512, 0, 512);
    
    graph.add(instance);
    
    var context = document.getElementById('target').getContext('2d');  
    var canvas = new CanvasRender(context);
    canvas.draw(graph);
  }); 
  
  
  resources.loadPackage('game/assets.json');
});
