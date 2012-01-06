define(function(require) {

  var Character = require('../../entities/character');
  var Npc = require('../../entities/npc');
  var Scene = require('../../scene/scene');
  var InputEmitter = require('../../input/inputemitter');
  var Controller = require('../../entities/controller');
  var Debug = require('../../entities/debug');
  var Map = require('../../static/map');
  var Context = require('../../harness/context');
  var $ = require('jquery');
    var Grid = require('../../editor/grid');
    
  var Demo = function(element) {
    this.element = element;
  };

  Demo.prototype = {
    start: function(context) {          
      this.context = context;
            
      var character = new Character("player", 0, 0);
      var questGiver = new Npc("quest-giver", 150, 100);
      var controller = new Controller();
      
      var mapResource = context.resources.get('/main/world.json');
      var map = new Map(mapResource.get());
      
      context.scene.add(character);
      context.scene.add(controller);
      context.scene.add(map);
      context.scene.add(questGiver);
      
      // Until I have textures
      this.grid = new Grid(map);
      this.context.scene.add(this.grid); 
      var input = new InputEmitter(context.scene, this.element);

    }
  }

  $(document).ready(function() {
    var canvasElement = document.getElementById('target');
    var context = new Context(canvasElement, new Demo(canvasElement));            
  }); 
});
