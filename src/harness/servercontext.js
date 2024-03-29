define(function(require) {

  var PackagedResources = require('../resources/packagedresources');
  var ServerPackage = require('../resources/serverpackage');
  
  var Scene = require('../scene/scene');
  var Camera = require('../scene/camera');
  var Coords = require('../shared/coords');
  var EntityFactory = require('../entities/entityfactory');

  var ServerContext = function(app) {
    this.resources = new PackagedResources(null, function() { return new ServerPackage(); });
    this.app = app;
    this.resources.on('loaded', this.onResourcesLoaded, this); 
    this.resources.loadPackage('site/game/assets.json');
    this.entityFactory = new EntityFactory();
    this.entityFactory.on('EntityCreated', this.onEntityCreated, this);
  };
  
  ServerContext.prototype = {    
    onResourcesLoaded: function() { 
      var self = this;
      this.scene = new Scene(this.resources, new Camera());      
      this.app.start(this);
      
      setInterval(function() {    
        self.scene.tick();
      }, 1000 / 30);   
    },
    createEntity: function(type, id, data) {
      return this.entityFactory.createEntity(type, id, data);
    },
    onEntityCreated: function(ev) {
      var entity = ev.entity;
      entity.$CreationData = ev.data;
      entity.$Type = ev.type;   
    },
    getSerializedEntities: function() {
      var data = {};
      this.scene.each(function(entity) {
        if(!entity.$Type) return;
        data[entity.id] = {
          data: entity.$CreationData,
          type: entity.$Type,
          sync: {}
        };
        entity._out(data[entity.id].sync);
      });
      return data;
    },
    getSerialisedEntity: function(id) {
      var entity = this.scene.get(id);
      var item = {
        id: id,
        data: entity.$CreationData,
        type: entity.$Type,
        sync: {}
      };
      entity._out(item.sync);
      return item;
    },
  };
  
  return ServerContext;
});
