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
  var DuckTemplate = require('../../scripting/items/duck');
  var Item = require('../../scripting/item');
  var Pickup = require('../../entities/pickup');
  var QuestAsker = require('../../ui/questasker');
    
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
      
      var duckOne = new Item('duck1', DuckTemplate);
      var duckTwo = new Item('duck2', DuckTemplate);
      var duckThree = new Item('duck3', DuckTemplate);
      var duckFour = new Item('duck4', DuckTemplate);
      var duckFive = new Item('duck5', DuckTemplate);
      
      // And until I have enemies to spawn
      context.scene.add(new Pickup(320, 220, duckOne));
      context.scene.add(new Pickup(420, 320, duckTwo));
      context.scene.add(new Pickup(420, 420, duckThree));
      context.scene.add(new Pickup(420, 520, duckFour));
      context.scene.add(new Pickup(520, 520, duckFive));
      
      // Until I have a UI manager
      this.questAsker = new QuestAsker(context.scene, $('#quest-started'));
    }
  }

  $(document).ready(function() {
    var canvasElement = document.getElementById('target');
    var context = new Context(canvasElement, new Demo(canvasElement));            
  }); 
});
