define(function(require) {
  var _ = require('underscore');
  var vec3 = require('glmatrix').vec3;
  var Entity = require('../scene/entity');
  
  var EntitySpawner = function(id, data) {
    Entity.call(this, id);
    this.radius = data.radius;
    this.position = vec3.create([data.x,data.y,data.z]);
    this.type = data.type;
    this.rate = data.rate;
    this.ticks = 0;
    this.maxcount = data.maxcount;
    this.currentCount = 0;
    this.scene = null;
    this.template = data.template;
    this.ownedEntities = {};
    this.on('AddedToScene', this.onAddedToScene, this);
    this.on('Tick', this.onTick, this);
  };
  
  EntitySpawner.prototype = {
    onAddedToScene: function(scene) {
      this.scene = scene;
      scene.on('EntityRemoved', this.onEntityRemoved, this);
    },
    onTick: function() {
      ++this.ticks;
      if(this.currentCount < this.maxcount && (this.ticks % this.rate === 0))
        this.spawn();
    },
    onEntityRemoved: function(id) {
      if(this.ownedEntities[id]) {
        delete this.ownedEntities[id];
        this.currentCount--;      
      }
    },
    spawn: function() {
      var data = this.template;
      data.x = this.position[0];
      data.y = this.position[1];
      var id = this.type + parseInt(Math.random() * 1000000);
      this.scene.dispatch('god', 'createEntity', [ id, this.type, data ]);
      this.currentCount++;
      this.ownedEntities[id] = {};
    }
  };
  
  _.extend(EntitySpawner.prototype, Entity.prototype);
  
  return EntitySpawner;
});
