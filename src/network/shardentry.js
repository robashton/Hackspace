define(function(require) {
  var _ = require('underscore');

  var ShardEntry = function(io) {
    this.io = io;
    this.sockets = [];
    this.startListening();
  };
  
  ShardEntry.prototype = {
    startListening: function() {
      var self = this;
      this.io.of('/game')
        .on('connection', function(socket) {
          self.handleNewSocket(socket);
        });
    },
    handleNewSocket: function(socket) {
      this.sockets.push(socket);
      var self = this;
      socket.on('start', function(data) {
        self.handleSocketStarted(socket, data);
      });
    },
    handleSocketStarted: function(socket, data) {
 
    }
  };
  
  return ShardEntry;
});
