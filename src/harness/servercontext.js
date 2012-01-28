define(function(require) {

  var PackagedResources = require('../resources/packagedresources'); 
  var Camera = require('../scene/camera');
  var Coords = require('../shared/coords');
  var EntityFactory = require('../entities/entityfactory');


  var Context = function(element, app) {
    this.resources = new FakeResources();
    this.element = element;
    this.wrappedElement = $(this.element); 
    this.context = element.getContext('2d');
    this.app = app;
    this.resources.on('loaded', this.onResourcesLoaded, this); 
    this.resources.loadPackage('game/assets.json');
    this.entityFactory = new EntityFactory();
  };
  
  Context.prototype = {    
    onResourcesLoaded: function() { 
      var self = this;
      this.scene = new Scene(this.resources);      
      this.app.start(this);
      
      setInterval(function() {    
        self.scene.tick();
      }, 1000 / 30);   
    },
    createEntity: function(type, id, data) {
      return this.entityFactory.create(type, id, data);
    }
  };
  
  return Context;
});
