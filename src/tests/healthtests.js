define(function(require) {
  var setup = require('./setup');
  var HasHealth = require('../entities/components/hashealth');
  var God = require('../entities/god');
  var ItemGeneration = require('../generation/itemgeneration');
  var when = require('when').when;
  var Character = require('../entities/character');
  
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
    
      entity.once('HealthZeroed', function() {
        then("The entity reaches zero health", true);
      });
      
      scene.once('HealthZeroed', function(data, sender) {
        then("The scene is notified of the death", true);
        then("The scene is notified of the death specifically to do with the entity", sender === entity);
      });
    
      entity.dispatch('removeHealth', [ 6 ]);
    });
  });
  
  when("an entity dies and God is watching", function(then) {
      sceneWithEntityThatHasHealth(5, function(scene, entity) {  
        var god = new God(null, new ItemGeneration());
        scene.add(god);  
        entity.dispatch('removeHealth', [ 6 ]);        
        var sceneEntity = scene.get(entity.id);
        then("The entity gets removed from the scene", !sceneEntity);       
      });
  });
  
  
  when("an entity deals enough damage to kill a target when God is watching", function(then) {
    setup.withEmptyScene(function(scene) { 
      var target = new Character('target', 0, 0);
      target.component(HasHealth).amount = 5;
      
      var retrievedTarget = null;
      var eventWasRaised = false;
      scene.add(target);
      scene.addEntityWith('test', [{
        notifyKilledTarget: function(targetId) {
          retrievedTarget = scene.get(targetId);
          eventWasRaised = true;
        }
      }]);
   
      var god = new God(null, new ItemGeneration());
      scene.add(god);  
      
      target.dispatch('applyDamage', [{
        dealer: 'test',
        physical: 6
      }]);        
      
      var sceneEntity = scene.get(target.id);
      
      then("Killer was notified that killing happened", eventWasRaised);
      then("Killer was able to retrieve target from the scene before it died", target === retrievedTarget);
      then("The entity gets removed from the scene", !sceneEntity);       
    });
  });

  
});














