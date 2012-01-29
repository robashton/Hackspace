define(function(require) {
  var _ = require('underscore');

  var Commander = function(socket, scene, playerId) {
    this.playerId = playerId;
    this.scene = scene;
    this.socket = socket;
    this.hookSocketEvents();
  };
  
  Commander.prototype = {
    dispatch: function(command, args) {
      // Send to server
      this.socket.emit('CommandDispatch', {
        command: command,
        args: args
      });
      // Dispatch locally
      this.scene.dispatch(this.playerId, command, args);
    },
    hookSocketEvents: function() {
      var self = this;
      this.socket.on('CommandDispatch', function(data) {
        self.scene.dispatch(data.targetId, data.command, data.args);
      });
    }
  };
  
  return Commander;
});
