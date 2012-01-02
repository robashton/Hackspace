define(function(require) {

  var Material = require('../../render/material');
  var Quad = require('../../render/quad');
  var Character = require('../../entities/character');
  var Scene = require('../../scene/scene');
  var InputEmitter = require('../../input/inputemitter');
  var Controller = require('../../entities/controller');
  var Debug = require('../../entities/debug');
  var Map = require('../../static/map');
  var Context = require('../../harness/context');
  var $ = require('jquery');
  
  var Demo = function(element) {
    this.element = element;
  };
  
  Demo.prototype = {
    start: function(context) {          
      this.context = context;
      var material = new Material();
      material.diffuseTexture =  context.resources.get('/main/testtile.png');
      var quad = new Quad(material);
      
      var character = new Character("player", 0, 0, 25, 25, quad);
      var controller = new Controller();
      var debug = new Debug();
      
      context.scene.add(debug);
      context.scene.add(character);
      context.scene.add(controller);
              
      var input = new InputEmitter(context.scene, this.element);
      
      var map = new Map(2048, 2048, 128, 128);
      map.generateRandom(context.resources);
      context.scenery.loadMap(map);
    }
  }

  $(document).ready(function() {
    var canvasElement = document.getElementById('target');
    var context = new Context(canvasElement, new Demo(canvasElement));            
  }); 
});
