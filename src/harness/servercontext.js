define(function(require) {

  var PackagedResources = require('../resources/packagedresources');
  var ServerPackage = require('../resources/serverpackage');
  
  var Scene = require('../scene/scene');
  var Camera = require('../scene/camera');
  var Coords = require('../shared/coords');
  var EntityFactory = require('../entities/entityfactory');

  var ServerContext = function(app) {
    this.resources = new PackagedResources(function() { return new ServerPackage(); });
    this.app = app;
    this.resources.on('loaded', this.onResourcesLoaded, this); 
    this.resources.loadPackage('site/game/assets.json');
    this.entityFactory = new EntityFactory();
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
      return this.entityFactory.create(type, id, data);
    }
  };
  
  return ServerContext;
});
