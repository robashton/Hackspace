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
  var HealthBars = require('../../ui/healthbars');
  var Monster = require('../../entities/monster');
  var Death = require('../../entities/death');
  var Collider = require('../../entities/collider');
    
  var Demo = function(element) {
    this.element = element;
  };

  Demo.prototype = {
    start: function(context) {          
      this.context = context;
            
      var character = new Character("player", 0, 0);
      var questGiver = new Npc("quest-giver", 150, 100);
      var controller = new Controller();
      var collider = new Collider();
      var healthbars = new HealthBars(this.context);
      
      var mapResource = context.resources.get('/main/world.json');
      var map = new Map(mapResource.get());
      
      context.scene.add(character);
      context.scene.add(controller);
      context.scene.add(map);
      context.scene.add(questGiver);
      context.scene.add(collider);
      
      // Until I have textures
      this.grid = new Grid(map);
      this.context.scene.add(this.grid); 
      var input = new InputEmitter(context);

      for(var i = 0; i < 20; i++) {      
        context.scene.add(new Monster('monster-' + i, Math.random() * 1000 + 200, Math.random() * 1000 + 20, 'spider'));
      }
  
      // Until I have a UI manager
      this.questAsker = new QuestAsker(context.scene, $('#quest-started'));
      this.death = new Death(context.scene);
    }
  }

  $(document).ready(function() {
    var canvasElement = document.getElementById('target');
    var context = new Context(canvasElement, new Demo(canvasElement));            
  }); 
});
