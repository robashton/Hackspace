define(function(require) {
  var _ = require('underscore');
  var Eventable = require('../shared/eventable');
  var ServerContext = require('../harness/servercontext');
  var Collider = require('../entities/collider');
  var God = require('../entities/god');
  
  var ShardEntry = function(map, persistence) {
    Eventable.call(this);
    this.map = map;
    this.communication = null;
    this.context = null;
    this.persistence = persistence;
    this.setupScene();
  };
  
  ShardEntry.prototype = {
    setupScene: function() {
      var self = this;
      this.context = new ServerContext({
        start: function(context) {
          self.context = context;
          self.initializeScene();
      }});
    },
    
    initializeScene: function() {
      var entities = this.getDefaultSceneData();
      for(var id in entities) {
        var item = entities[id];
        var entity = this.context.createEntity(item.type, id, item.data);
        this.context.scene.add(entity);       
      }
      
      this.context.scene.on('CommandDispatched', this.onSceneCommandDispatched, this);
           
      var collider = new Collider();
      this.context.scene.add(collider);
      var god = new God(this.context.entityFactory);
      this.context.scene.add(god);    
      this.persistence.startMonitoring(this.context.scene);   
      this.raise('SceneLoaded');  
    },
    
    onSceneCommandDispatched: function(data) {
      this.communication.broadcastAll('CommandDispatch', {
        id: data.id,
        command: data.command,
        args: data.args
      });
    },
    
    onStartup: function(communication) {
      this.communication = communication;
    },
    
    onNewSocket: function(socket) {
      this.handleNewSocket(socket);
      var self = this;
      socket.on('CommandDispatch', function(data) {   
        socket.get('Username', function(err, username) {
          self.context.scene.dispatch(username, data.command, data.args);
        });   
      });
    },
    
    onSocketLost:  function(socket) {
      this.handleDisconnectedSocket(socket);
    }, 
        
    handleNewSocket: function(socket) {
      var self = this;
      socket.on('Ready', function() {
        socket.get('Username', function(err, username) {
          self.addPlayerToScene(username, function() {
            self.initializePlayer(socket, username);
          });
        });    
      });
    },
    
    initializePlayer: function(socket, id) {
      var data = {
        playerid: id,
        map: this.map,
        entities: this.context.getSerializedEntities()
      };
      socket.emit('Init', data);
      socket.broadcast.emit('PlayerJoined', this.context.getSerialisedEntity(id));   
    },
    
    handleDisconnectedSocket: function(socket) {
      var self = this;
      socket.get('Username', function(err, username) {
        self.persistence.syncPlayer(username);
        self.context.scene.withEntity(username, function(entity) {
          self.context.scene.remove(entity);
        });
        socket.broadcast.emit('PlayerLeft', username);
      });
    },

    addPlayerToScene: function(id, callback) {
      var self = this;
      this.persistence.playerExists(id, function(exists) {      
        if(exists) 
          self.loadExistingPlayerIntoScene(id, callback);
        else
          self.createNewPlayerIntoScene(id, callback);
      });
    },
    
    loadExistingPlayerIntoScene: function(id, callback) {
      var self = this;
      this.persistence.getPlayerData(id, function(data) {
        var entity = self.context.createEntity('character', id, data);
        self.context.scene.add(entity);
        callback();      
      });
    },
    
    createNewPlayerIntoScene: function(id, callback) {
      // Create in tutorial village ;-)
      var self = this;
      this.persistence.createPlayer(id, function(data) {
        data.x = 0;
        data.y = 0;
        var entity = self.context.createEntity('character', id, data);
        self.context.scene.add(entity);
        callback();
      });
    },    
    
    getDefaultSceneData: function() {

     var entities = {
        'quest-giver': {
          type: 'npc',
          data: {
            x: 150,
            y: 100
          }
        }    
      };
                  
      for(var i = 0; i < 20; i++) {     
        entities['monster-' + i] = {
          type: 'monster',
          data: {
            x: Math.random() * 1000 + 200,
            y: Math.random() * 1000 + 200,
            texture: 'spider'
          }        
        };
      }
      return entities;   
    }
  };
  _.extend(ShardEntry.prototype, Eventable.prototype);
  
  return ShardEntry;
});
