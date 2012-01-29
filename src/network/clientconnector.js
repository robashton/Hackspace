define(function(require) {
  var _ = require('underscore');
  var Controller = require('../entities/controller');
  var Map = require('../static/map');
  var Grid = require('../editor/grid');
  var Eventable = require('../shared/eventable');
  
  var ClientConnector = function(context) {
    Eventable.call(this);
    this.context = context;
    this.connectToServer();
  };
  
  ClientConnector.prototype = {
    connectToServer: function() {
      this.socket = io.connect();
      var self = this;
      this.socket.on('init', function(data) {
        self.populateSceneFromMessage(data);
      });
    },
    populateSceneFromMessage: function(data) {   
    
      for(var id in data.entities) {
        var item = data.entities[id];
        var entity = this.context.createEntity(item.type, id, item.data);
        entity._in(item.sync);
        this.context.scene.add(entity);       
      }    
    
      var controller = new Controller();
      this.context.scene.add(controller);
      this.loadMap(data.map);
      this.raise('GameStarted'); 
    },
    loadMap: function(path) {
      var mapResource = this.context.resources.get(path);
      var map = new Map(mapResource.get());
      this.context.scene.add(map);
      this.grid = new Grid(map);
      this.context.scene.add(this.grid); 
    }
  };
  _.extend(ClientConnector.prototype, Eventable.prototype);
  
  return ClientConnector;
});
