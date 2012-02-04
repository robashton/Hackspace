define(function(require) {
  var _ = require('underscore');
  var Eventable = require('../shared/eventable');

  var LoginServer = function() {

  };
  
  LoginServer.prototype = {
   onNewSocket: function(socket) {
    var self = this;
    socket.on('Authenticate', function(data) {
      socket.emit('AuthenticateResponse', {
        success: true,
        user: data.username
      });
      socket.set('Username', data.username);
    });
   }
  };
  
  _.extend(LoginServer.prototype, Eventable.prototype);
  
  return LoginServer;
});
