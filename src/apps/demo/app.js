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
      material.diffuseTexture =  context.resources.get('/main/character-up.png');
      var quad = new Quad(material);
      
      var character = new Character("player", 0, 0, 25, 25, quad);
      var controller = new Controller();
      var debug = new Debug();
      
      var mapResource = context.resources.get('/main/world.json');
      var map = new Map(mapResource.get());
      
      context.scene.add(debug);
      context.scene.add(character);
      context.scene.add(controller);
      context.scene.add(map);
            
      var input = new InputEmitter(context.scene, this.element);

    }
  }

  $(document).ready(function() {
    var canvasElement = document.getElementById('target');
    var context = new Context(canvasElement, new Demo(canvasElement));            
  }); 
});
