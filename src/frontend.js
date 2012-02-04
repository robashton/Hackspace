(function() {
  var requirejs = require('./bootstrap');
  var socketio = requirejs('socket.io');
  var ShardEntry = requirejs('./network/shardentry');
  var LoginServer = requirejs('./network/loginserver');
  var FrontServer = requirejs('./network/frontserver');
  
  var FrontendServer = function(server) {
    this.server = server;
    this.io = null;
    this.shard = null;
    this.startListening();
  };
  
  FrontendServer.prototype = {
    startListening: function() {
      this.io = socketio.listen(this.server);
      var self = this;
      
      var shard = new ShardEntry('/main/world.json');
      shard.on('SceneLoaded', function() {
        var login = new LoginServer(); 
        
        self.communication = new FrontServer(self.io, [
          login, shard
        ]);
      });
    }
  };
  
  module.exports = FrontendServer;

}).call(this);
