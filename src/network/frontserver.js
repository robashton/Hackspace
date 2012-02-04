define(function(require) {
  var _ = require('underscore');

  var FrontServer = function(io, listeners) {
    this.io = io;
    this.sockets = [];
    this.listeners = listeners;
    var self = this;
    this.io.sockets.on('connection', function(socket) {
      self.registerSocket(socket);
    });
    this.notifyListenersOfStartup();  
  };
  
  FrontServer.prototype = {
    registerSocket: function(socket) {
      this.sockets.push(socket);
      var self = this;
      socket.on('disconnect', function() {
        self.unregisterSocket(socket);
      });
      this.notifyListenersOfNewSocket(socket);
    },
    unregisterSocket: function(socket) {
      this.sockets = _(this.sockets).without(socket);
      this.notifyListenersThatSocketIsGone(socket);
    },
    broadcastAll: function(message, data) {
      for(var i = 0 ; i < this.sockets.length; i++) {
        this.sockets[i].emit(message, data);
      }
    },
    notifyListenersOfStartup: function() {
      for(var i = 0; i < this.listeners.length; i++) {
        var listener = this.listeners[i];
        if(listener.onStartup)
          listener.onStartup(this);
      } 
    },
    notifyListenersOfNewSocket: function(socket) {
      for(var i = 0; i < this.listeners.length; i++) {
        var listener = this.listeners[i];
        if(listener.onNewSocket)
          listener.onNewSocket(socket);
      }
    },
    notifyListenersThatSocketIsGone: function(socket) {
      for(var i = 0; i < this.listeners.length; i++) {
        var listener = this.listeners[i];
        if(listener.onLostSocket)
          listener.onLostSocket(socket);
      }
    }
  };
  
  return FrontServer;
});
