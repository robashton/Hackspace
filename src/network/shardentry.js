define(function(require) {
  var _ = require('underscore');
  var Eventable = require('../shared/eventable');
  var ServerContext = require('../harness/servercontext');
  
  var ShardEntry = function(io, map) {
    Eventable.call(this);
    this.io = io;
    this.sockets = [];
    this.on('SceneLoaded', this.startListening, this);
    this.map = map;
    this.context = null;
    this.setupScene();
  };
  
  ShardEntry.prototype = {
    setupScene: function() {
      var self = this;
      this.context = new ServerContext({
        start: function(context) {
          self.context = context;
          var entities = self.getDefaultSceneData();
          for(var id in entities) {
            var item = entities[id];
            var entity = context.createEntity(item.type, id, item.data);
            context.scene.add(entity);       
          }
          
          context.scene.on('CommandDispatched', self.onSceneCommandDispatched, self);
          
          self.raise('SceneLoaded');  
        }
      });
    },
    
    onSceneCommandDispatched: function(data) {
      for(var i = 0; i < this.sockets.length; i++) {
        var socket = this.sockets[i];
        socket.emit('CommandDispatch', {
          id: data.id,
          command: data.command,
          args: data.args
        });
      }
    },
    
    startListening: function() {
      var self = this;
      
      this.io.sockets.on('connection', function(socket) {
        self.handleNewSocket(socket);
        
        socket.on('CommandDispatch', function(data) {          
          self.context.scene.dispatch(socket.id, data.command, data.args);
        });
        
        socket.on('disconnect', function() {
          self.handleDisconnectedSocket(socket);
        });
      });
      
    },
    
    handleDisconnectedSocket: function(socket) {
      this.sockets = _(this.sockets).without(socket);
      var self = this;
      this.context.scene.withEntity(socket.id, function(entity) {
        self.context.scene.remove(entity);
      });
      socket.broadcast.emit('PlayerLeft', socket.id);
    },
    
    handleNewSocket: function(socket) {
      this.sockets.push(socket);
      
      this.addPlayerToScene(socket.id);
        
     var data = {
        playerid: socket.id,
        map: this.map,
        entities: this.context.getSerializedEntities()
      };    
      
      socket.emit('Init', data);
      socket.broadcast.emit('PlayerJoined', this.context.getSerialisedEntity(socket.id));
    },
    addPlayerToScene: function(id) {
      var entity = this.context.createEntity('character', id, {
        x: 0,
        y: 0
      });
      this.context.scene.add(entity);
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
    },
  };
  _.extend(ShardEntry.prototype, Eventable.prototype);
  
  return ShardEntry;
});
