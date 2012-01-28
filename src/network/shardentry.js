define(function(require) {
  var _ = require('underscore');
  var Eventable = require('../shared/eventable');
  
  var ShardEntry = function(io, map) {
    Eventable.call(this);
    this.io = io;
    this.sockets = [];
    this.on('SceneLoaded', this.startListening, this);
    this.setupScene();
    this.map = map;
  };
  
  ShardEntry.prototype = {
    setupScene: function() {
      this.raise('SceneLoaded');
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
        map: this.map,
        entities: {
          'player': {
            type: 'character',
            data: { x: 0, y: 0 }
          },
          'quest-giver': {
            type: 'npc',
            data: {
              x: 150,
              y: 100
            }
          }    
        }
      };
                  
      for(var i = 0; i < 20; i++) {     
        data.entities['monster-' + i] = {
          type: 'monster',
          data: {
            x: Math.random() * 1000 + 200,
            y: Math.random() * 1000 + 200,
            texture: 'spider'
          }        
        };
      }   
      
      socket.emit('init', data);
    }
  };
  _.extend(ShardEntry.prototype, Eventable.prototype);
  
  return ShardEntry;
});
