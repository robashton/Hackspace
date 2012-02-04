define(function(require) {
  var _ = require('underscore');
  var Eventable = require('../shared/eventable');

  var Identify = function(socket) {
    Eventable.call(this);
    this.socket = socket;
    var self = this;
    this.socket.on('AuthenticateResponse', function(response) {
      self.handleAuthenticateResponse(response);
    });
  };
  
  Identify.prototype = {
    ask: function() {
      var self = this;
      $('#identify-player').show();
      $('#identify-submit').on({
        click: function() {
          self.submitCredentials();
        }      
      });
    },
    submitCredentials: function() {
      var username = $('#player-name').val();
      this.socket.emit('Authenticate', {
        username: username
      });
    },
    handleAuthenticateResponse: function(response) {
      if(response.success) {
        this.raise('Authenticated', response.user);
      } else {
        $('#identify-failed').show();
      }
    }
  };
  
  Identify.Ask = function(socket, handlers) {
    var identifier = new Identify(socket);
    identifier.autoHook(handlers);
    identifier.on('Authenticated', function() {
      $('#identify-player').hide("fast");
    });
    identifier.ask();
  };  
  
  _.extend(Identify.prototype, Eventable.prototype);
  
  return Identify;
});
