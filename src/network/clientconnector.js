define(function(require) {
  var _ = require('underscore');
  var Controller = require('../entities/controller');
  var ChaseCamera = require('../entities/chasecamera');
  var Commander = require('./commander');
  var Map = require('../static/map');
  var Grid = require('../editor/grid');
  var Eventable = require('../shared/eventable');
  
  var ClientConnector = function(socket, context) {
    Eventable.call(this);
    this.context = context;
    this.socket = socket;
    this.connectToServer();
  };
  
  ClientConnector.prototype = {
    connectToServer: function() {
      var self = this;
      this.socket.on('Init', function(data) {
        self.populateSceneFromMessage(data);
      });
      this.socket.on('PlayerJoined', function(data) {
        self.addEntityFromData(data.id, data);
      });
      this.socket.on('PlayerLeft', function(id) {
        self.context.scene.withEntity(id, function(entity) {
          self.context.scene.remove(entity);
        });
      });
      this.socket.emit('Ready');
    },
    addEntityFromData: function(id, item) {
      var entity = this.context.createEntity(item.type, id, item.data);
      entity._in(item.sync);
      this.context.scene.add(entity);  
    },
    populateSceneFromMessage: function(data) {    
      for(var id in data.entities) {
        var item = data.entities[id];
        this.addEntityFromData(id, item);
      }      
      var commander = new Commander(this.socket, this.context.scene, data.playerid);
      var controller = new Controller(commander);
      var chase = new ChaseCamera(this.context.scene, data.playerid);
      this.context.scene.add(controller);
      this.loadMap(data.map);
      this.raise('GameStarted', data); 
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
