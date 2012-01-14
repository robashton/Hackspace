define(function(require) {

  var when = require('when').when;
  var setup = require('./setup');
    

  setup.withACharacterAndMonster(function(scene, character, monster) {   
    when("A character is actioned to go to a monster that is moving towards the character", function(then) {
      character.dispatch('primaryAction', ['monster']);
      character.dispatch('moveTo', [ 9.9, 9.9, 0 ]);
      
      character.once('DestinationReached', function() {
        then("The player destination is reached when proximity is reduced", true);
      });
      monster.once('DestinationReached', function() {
        then("The monster destination is reached when proximity is reduced", true);
      });
      character.once('AttackedTarget', function() { 
        then("The character attacks the monster", true);
      });
      monster.once('AttackedTarget', function() { 
        then("The monster attacks the character", true); 
      });
      scene.tick()    
    });
    
    when("A character and a monster have met", function(then) {
      var characterMoved = false;
      var monsterMoved = false;
      var monsterDirected = false;
      var monsterAttacked = false;
      var characterAttacked = false;
      
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
    setup.withACharacterAndMonster(function(scene, character, monster) {      
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
