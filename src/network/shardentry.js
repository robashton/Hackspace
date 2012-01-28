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
          self.raise('SceneLoaded');  
        }
      });
    },
    startListening: function() {
      var self = this;
      
      this.io.sockets.on('connection', function(socket) {
        self.handleNewSocket(socket);
      });
    },
    
    handleNewSocket: function(socket) {
      this.sockets.push(socket);
      
      var data = {
        playerid: 'player',
        map: this.map
      };
      
      var entities = _.clone(this.getDefaultSceneData());
      data.entities = entities;
      data.entities['player'] = {
        type: 'character',
        data: {
          x: 0,
          y: 0
        }      
      };                  
      
      socket.emit('init', data);
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
