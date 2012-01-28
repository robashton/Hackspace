define(function(require) {
  var setup = require('./setup');
  var Character = require('../entities/character');
  var Monster = require('../entities/monster');
  var when = require('when').when;
  
  when("An entity is 'picked' from the scene", function(then) {
    setup.withEmptyScene(function(scene) {
      var character = new Character("player", 0, 0);
      scene.add(character);
            
      var returnedCharacter = scene.entityAtMouse(0,0);
            
      then("The entity at the point passed in is returned", character === returnedCharacter);           
    });
  });
  
  when("An entity is 'picked' from the scene and there are two entities at that point", function(then) {
    setup.withEmptyScene(function(scene) {
      var character1 = new Character("player", 0, 0);
      scene.add(character1);
      var character2 = new Character("player2", 0, 0);
      scene.add(character2);   
      var returnedCharacter = scene.entityAtMouse(0,0);
            
      then("The first added entity is the one that is returned", character1 === returnedCharacter);           
    });
  });
  
  when("An entity is requested from the scene by position and a filter is applied", function(then) {
    setup.withEmptyScene(function(scene) {
      var character1 = new Character("player", 0, 0);
      scene.add(character1);
      var character2 = new Character("player2", 0, 0);
      scene.add(character2);   
      var returnedCharacter = scene.entityAtMouse(0,0, function(entity) {
        return entity !== character1;
      });
            
      then("The entity matching the filter is returned", character2 === returnedCharacter);           
    });
  });
  
});
