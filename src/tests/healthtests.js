define(function(require) {
  var setup = require('./setup');
  var HasHealth = require('../entities/components/hashealth');
  var Death = require('../entities/death');
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
  
  when("an entity dies and there is Death surveying the scene", function(then) {
      sceneWithEntityThatHasHealth(5, function(scene, entity) {  
        var death = new Death(scene);  
        entity.dispatch('removeHealth', [ 6 ]);        
        var sceneEntity = scene.get(entity.id);
        then("The entity gets removed from the scene", !sceneEntity);       
      });
  });
  
  
  when("an entity deals enough damage to kill a target when Death is surveying the scene", function(then) {
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
     
      var death = new Death(scene);  
      
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














