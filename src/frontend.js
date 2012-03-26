(function() {
  var requirejs = require('./bootstrap');
  var socketio = requirejs('socket.io');
  var ShardEntry = requirejs('./network/shardentry');
  var LoginServer = requirejs('./network/loginserver');
  var FrontServer = requirejs('./network/frontserver');
  var Persistence = requirejs('./persistence/inmemory');
  
  var FrontendServer = function(server) {
    this.server = server;
    this.io = null;
    this.shard = null;
    this.persistence = new Persistence();
    this.startListening();
  };
  
  FrontendServer.prototype = {
    startListening: function() {
      this.io = socketio.listen(this.server);
      var self = this;
      this.io.configure(function() {
        self.io.set('log level', 1);
      });
      var self = this;
      
      var shard = new ShardEntry('main/world.json', this.persistence);
      var login = new LoginServer(); 
      
      shard.on('SceneLoaded', function() {
        self.communication = new FrontServer(self.io, [
          login, shard
        ]);
      });
    }
  };
  
  module.exports = FrontendServer;

}).call(this);
