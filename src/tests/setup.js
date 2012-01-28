define(function(require) {

 var when = require('when').when;
  var Scene = require('../scene/scene');
  var FakeRenderer = require('./doubles/fakerenderer');
  var FakeResources = require('./doubles/fakeresources');
  var Camera = require('../scene/camera');
  var Character = require('../entities/character');
  var Monster = require('../entities/monster');
  var Entity = require('../scene/entity');
    
  var withEmptyScene = function(callback) {
    var renderer = new FakeRenderer();
    var resources = new FakeResources();
    var camera = new Camera();
    var scene = new Scene(resources, camera,  renderer);
    scene.addEntityWith = function(id, components) {
      var entity = new Entity(id);
      for(var i in components)
        entity.attach(components[i]);
      scene.add(entity);
      return entity;    
    };
    callback(scene);
  };
  
  var withACharacterAndMonster = function(callback) {
    withEmptyScene(function(scene) {        
      var character = new Character("player", {x: 0, y: 0});
      scene.add(character);
      var monster = new Monster('monster', {x: 10, y: 10, texture: 'spider'});
      scene.add(monster);
      callback(scene, character, monster);    
    });
  };
  
  return {
    withEmptyScene: withEmptyScene,
    withACharacterAndMonster: withACharacterAndMonster  
  };
    
});
