(function() {
  var requirejs = require('./bootstrap');
  var socketio = requirejs('socket.io');
  var ShardEntry = requirejs('./network/shardentry');
  
  var FrontendServer = function(server) {
    this.server = server;
    this.io = null;
    this.shard = null;
    this.startListening();
  };
  
  FrontendServer.prototype = {
    startListening: function() {
      this.io = socketio.listen(this.server);
      this.shard = new ShardEntry(this.io, '/main/world.json');
    }
  };
  
  module.exports = FrontendServer;

}).call(this);
