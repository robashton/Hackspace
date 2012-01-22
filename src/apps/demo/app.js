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
  var Item = require('../../scripting/item');
  
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
      
      // TODO: This will come from the server
      var character = context.createEntity('character', 'player', {
        x: 0,
        y: 0
      });
      var questGiver = context.createEntity('npc', 'quest-giver', {
        x: 150,
        y: 100
      });

      var monsters = [];
      
      for(var i = 0; i < 20; i++) {      
        var monster = context.createEntity('monster', 'monster-' + i, {
          x: Math.random() * 1000 + 200,
          y: Math.random() * 1000 + 200,
          texture: 'spider'
        });
        monsters.push(monster);
      }
      
      var controller = new Controller();
      var collider = new Collider();
      var healthbars = new HealthBars(this.context);
      
      var mapResource = context.resources.get('/main/world.json');
      var map = new Map(mapResource.get());
      
      context.scene.add(character);
      context.scene.add(map);
      context.scene.add(questGiver);
     
      for(var i in monsters)
        context.scene.add(monsters[i]);
      
      context.scene.add(collider);
      context.scene.add(controller);
      
      // Until I have textures
      this.grid = new Grid(map);
      this.context.scene.add(this.grid); 
      var input = new InputEmitter(context);
        
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
