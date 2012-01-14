define(function(require) {
  var setup = require('./setup');
  var HasHealth = require('../entities/components/hashealth');
  var when = require('when').when;
  
  var sceneWithEntityThatHasHealth = function(amount, callback) {
    setup.withEmptyScene(function(scene) {
      var entity = scene.addEntityWith("test", [
        new HasHealth(5)
      ]);
      callback(scene, entity);
    });
  };  
    
  when("an entity has health which is decreased past zero", function(then) {
    sceneWithEntityThatHasHealth(5, function(scene, entity) {
    
      entity.once('Death', function() {
        then("The entity dies", true);
      });
      
      scene.once('Death', function(data, sender) {
        then("The scene is notified of the death", true);
        then("The scene is notified of the death specifically to do with the entity", sender === entity);
      });
    
      entity.dispatch('removeHealth', [ 6 ]);
    });
  });

  
});
