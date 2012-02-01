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
      this.socket.emit('CommandDispatch', {
        command: command,
        args: args
      });
    },
    hookSocketEvents: function() {
      var self = this;
      this.socket.on('CommandDispatch', function(data) {
        self.scene.dispatchDirect(data.id, data.command, data.args);
      });
    }
  };
  
  return Commander;
});
