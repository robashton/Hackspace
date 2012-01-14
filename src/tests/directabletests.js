define(function(require) {

  var when = require('when').when;
  var Scene = require('../scene/scene');
  var FakeRenderer = require('./doubles/fakerenderer');
  var FakeResources = require('./doubles/fakeresources');
  var Camera = require('../scene/camera');
  var Character = require('../entities/character');
  var Monster = require('../entities/monster');
    
  var withEmptyScene = function(callback) {
    var renderer = new FakeRenderer();
    var resources = new FakeResources();
    var camera = new Camera();
    var scene = new Scene(resources, renderer, camera);
    callback(scene);
  };
  
  var withACharacterAndMonster = function(callback) {
    withEmptyScene(function(scene) {        
      var character = new Character("player", 0, 0);
      scene.add(character);
      var monster = new Monster('monster', 10, 10, 'spider');
      scene.add(monster);
      callback(scene, character, monster);    
    });
  };
  
  withACharacterAndMonster(function(scene, character, monster) {   
    when("A character is actioned to go to a monster that is moving towards the character", function(then) {
      character.dispatch('primaryAction', ['monster']);
      character.dispatch('moveTo', [ 9.9, 9.9, 0 ]);
      
      character.once('DestinationReached', function() {
        then("The player destination is reached when proximity is reduced", true);
      });
      monster.once('DestinationReached', function() {
        then("The monster destination is reached when proximity is reduced", true);
      });
      scene.tick(); 
   
    });
    
    when("A character and a monster have met", function(then) {
      var characterMoved = false;
      var monsterMoved = false;
      var monsterDirected = false;
      character.once('PositionChanged', function() { characterMoved = true; });
      monster.once('PositionChanged', function() { monsterMoved = true;  });
      monster.once('DestinationTargetChanged', function() { monsterDirected = true;  });
      scene.tick();
      
      then("The character stops moving", !characterMoved);
      then("The monster stops moving", !monsterMoved);
      then("The monster isn't given further orders to move", !monsterDirected);
    });
    
  });

  when("A character has reached a monster and is actioned to go elsewhere", function(then) {
    withACharacterAndMonster(function(scene, character, monster) {      
      character.dispatch('primaryAction', ['monster']);
      character.dispatch('moveTo', [ 9, 9, 0 ]);
      
      monster.once('DestinationTargetChanged', function() {
        then("The monster seeks the character because of proximity", true);
      });
      scene.tick(); 
      
      character.dispatch('updateDestination', [ 0, 0, 0]);
      character.dispatch('moveTo', [ 1, 1, 0 ]);
      
      character.once('DestinationReached', function() {
        then("The character can reach the new destination", true);
      });

      scene.tick();
      
      var characterMoved = false;
      character.once('PositionChanged', function() {
        characterMoved = true;
      });
      scene.tick();
      then("The character stops moving after reaching the new destination", !characterMoved);
    });
  });

});
