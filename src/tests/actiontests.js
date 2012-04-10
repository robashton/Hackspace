define(function(require) {

  var when = require('when').when;
  var setup = require('./setup');
  var EquipmentTypes = require('../scripting/equipmenttypes');  

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

  /*
  when("An character moves into a monster", function(then) {
    setup.withACharacterAndMonster(function(scene, character, monster) {
      character.dispatch("primaryAction
    
    });
    then("The entity that moved is pushed back", false);
    then("The entity that was still stays in one place", false);
    then("The entity that moved stops", false);
  }); */ 


  when("A character is given a hat", function(then) {
    setup.withACharacterAndMonster(function(scene, character, monster) {
      character.dispatch('addInventoryItem', [{ id: 'test', equipType: EquipmentTypes.hat}]);
      var hat = character.get('ItemWithId', ['test']);
      then("The character has the hat in its inventory", hat);
    }); 
  });

  when("A character with a hat is told to equip that hat", function(then) {
    setup.withACharacterAndMonster(function(scene, character, monster) {
      character.dispatch('addInventoryItem', [ { id: 'test', equipType: EquipmentTypes.hat}]);
      character.dispatch('equip', ['test']);
      var inventoryHat = character.get('ItemWithId', ['test']);
      var equippedHat = character.get('ItemInSlot', [EquipmentTypes.hat]);
      then("The character has the item removed from its inventory", !inventoryHat);
      then("The character has the item equipped in the 'hat' slot", equippedHat);
    });
  });

  when("A character with a hat unequips a hat", function(then) {
     setup.withACharacterAndMonster(function(scene, character, monster) {
      character.dispatch('addInventoryItem', [ { id: 'test', equipType: EquipmentTypes.hat}]);
      character.dispatch('equip', ['test']);
      character.dispatch('unequip', [EquipmentTypes.hat]);

      var inventoryHat = character.get('ItemWithId', ['test']);
      var equippedHat = character.get('ItemInSlot', [EquipmentTypes.hat]);
      then("The character has the item added to its inventory", inventoryHat);
      then("The character has the item un-equipped from the 'hat' slot", !equippedHat);
    });
  });
});
