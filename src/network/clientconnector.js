define(function(require) {
  var _ = require('underscore');
  var Controller = require('../entities/controller');
  var ChaseCamera = require('../entities/chasecamera');
  var Commander = require('./commander');
  var Map = require('../static/map');
  var Grid = require('../editor/grid');
  var Eventable = require('../shared/eventable');
  var DynamicTileSource = require('../static/dynamictilesource');

  var ClientConnector = function(socket, context) {
    Eventable.call(this);
    this.context = context;
    this.socket = socket;
    this.playerId = null;
    this.connectToServer();
  };
  
  ClientConnector.prototype = {
    connectToServer: function() {
      var self = this;
      this.socket.on('Init', function(data) {
        self.populateSceneFromMessage(data);
        self.raise('PlayerCreated', data.playerid);
      });
      this.socket.on('Start', function() {
        self.raise('GameStarted'); 
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

      this.playerId = data.playerid; 
      for(var id in data.entities) {
        var item = data.entities[id];
        this.addEntityFromData(id, item);
      }      
      var commander = new Commander(this.socket, this.context.scene, data.playerid);
      var controller = new Controller(this.context.element, commander);
      var chase = new ChaseCamera(this.context.scene, data.playerid);
      this.context.scene.add(controller);
      this.loadMap(data.map); 
    },
    loadMap: function(path) {
      var tiles = new DynamicTileSource(this.context.resources, this.context.scene);
      var map = new Map(tiles, this.context.renderSettings);
      this.context.scene.add(map);
      this.grid = new Grid(map);
 //     this.context.scene.add(this.grid); 
    }
  };
  _.extend(ClientConnector.prototype, Eventable.prototype);
  
  return ClientConnector;
});
