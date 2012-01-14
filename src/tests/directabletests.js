define(function(require) {
  var when = require('when').when;
  var Directable = require('../entities/components/directable');
  var Entity = require('../scene/entity');
  var Scene = require('../scene/scene');
  var Character = require('../entities/character');
    
  var withEmptyScene = function(callback) {
    var scene = new Scene({}, {}, {});
    
    scene.addEntityWithComponents = function(components) {
      var entity = new Entity("test");
      for(var i in components)
        entity.attach(components[i]);
      scene.add(entity);
      return entity;
    };
    callback(scene);
  };
  
  when("a directable is given a destination", function(then) {
    withEmptyScene(function(scene) {
      var component = new Directable(2.0);
      var entity = scene.addEntityWithComponents([component, {
        moveTo: function() {},
        rotateTo: function() {} 
      }]);
      component.updateDestination(10, 10, 10);
      
      then('The directable starts moving', component.moving);
      then('The directable has no target', !component.targetId);
    });    
  });
  
  when("a directable is given a destination target", function(then) {
    withEmptyScene(function(scene) {
      var component = new Directable(2.0);
      var entity = scene.addEntityWithComponents([component, {
        moveTo: function() {},
        rotateTo: function() {} 
      }]);
      var target = scene.addEntityWithComponents([{
        getPosition: function() { return [ 10, 10, 10]; }
      }]);
      component.updateDestinationTarget(target.id);
      
      then('The directable starts moving', component.moving);
      then('The directable has a target', component.targetId);
    });    
  });

  when("a directable reaches a target position", function(then) {
    withEmptyScene(function(scene) {
      var component = new Directable(2.0);
      var entity = scene.addEntityWithComponents([component, {
        moveTo: function() {},
        rotateTo: function() {} 
      }]);
      component.updateDestination(10, 10, 10);
      component.onPositionChanged({x: 10, y: 10, z: 10});
      component.onTick();
      
      then('The directable ceases moving', !component.moving);
      then('The directable has no target', !component.targetId);
    });    
  });
  
   when("a directable reaches a target entity", function(then) {
    withEmptyScene(function(scene) {
      var component = new Directable(2.0);
      var entity = scene.addEntityWithComponents([component, {
        moveTo: function() {},
        rotateTo: function() {} 
      }]);
      var target = scene.addEntityWithComponents([{
        getPosition: function() { return [ 10, 10, 10]; }
      }]);
      component.updateDestinationTarget(target.id);
      component.onPositionChanged({x: 10, y: 10, z: 10});
      component.onTick();
      
      then('The directable ceases moving', !component.moving);
      then('The directable has no target', !component.targetId);
    });    
  });
  
  
  when("A character is actioned to go to a monster", function(then) {
    withEmptyScene(function(scene) {
      var character = new Character("test", 0, 0);
      scene.add(character);
    });  
  });

});
