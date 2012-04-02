define(function(require) {
  var when = require('when').when;
  var setup = require('./setup');
    

  setup.withACharacterAndMonster(function(scene, character, monster) {   
    when("A character and monster are together", function(then) {
      var value = character.get('IsEnemyWith', [monster]);
      then("They are enemies", value);
    });  
  });
});


