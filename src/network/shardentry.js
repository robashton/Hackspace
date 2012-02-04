define(function(require) {
  var _ = require('underscore');
  var Eventable = require('../shared/eventable');
  var ServerContext = require('../harness/servercontext');
  var Collider = require('../entities/collider');
  var God = require('../entities/god');
  
  
  var ShardEntry = function(map) {
    Eventable.call(this);
    this.map = map;
    this.communication = null;
    this.context = null;
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
        self.context.scene.dispatch(socket.id, data.command, data.args);
      });
    },
    
    onSocketLost:  function(socket) {
      this.handleDisconnectedSocket(socket);
    }, 
        
    handleNewSocket: function(socket) {
      var self = this;
      socket.on('Ready', function() {
        self.addPlayerToScene(socket.id);
          
        var data = {
          playerid: socket.id,
          map: self.map,
          entities: self.context.getSerializedEntities()
        };
        
        socket.emit('Init', data);
        socket.broadcast.emit('PlayerJoined', self.context.getSerialisedEntity(socket.id));
      });
    },
    
    handleDisconnectedSocket: function(socket) {
      var self = this;
      this.context.scene.withEntity(socket.id, function(entity) {
        self.context.scene.remove(entity);
      });
      socket.broadcast.emit('PlayerLeft', socket.id);
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
    }
  };
  _.extend(ShardEntry.prototype, Eventable.prototype);
  
  return ShardEntry;
});
