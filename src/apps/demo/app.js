define(function(require) {


  var InputEmitter = require('../../input/inputemitter');
  var Context = require('../../harness/context');
  var $ = require('jquery');
  
  var QuestAsker = require('../../ui/questasker');
  var HealthBars = require('../../ui/healthbars');
  var Collider = require('../../entities/collider');
  var God = require('../../entities/god');
  var ClientConnector = require('../../network/clientconnector');
  
  var Identify = require('../../ui/identify');
 
  var Demo = function(socket, element) {
    this.element = element;
    this.socket = socket;
  };

  Demo.prototype = {
    start: function(context) {        
      var self = this;  
      this.context = context;      
      var collider = new Collider();
      var healthbars = new HealthBars(this.context);
      context.scene.add(collider);
      var input = new InputEmitter(context);
      
      var god = new God(context.entityFactory);
      context.scene.add(god);
      
      this.connector = new ClientConnector(this.socket, this.context);
      this.connector.on('GameStarted', function(data) {
        self.questAsker = new QuestAsker(context.scene, data.playerid, $('#quest-started'));
      });
    }
  }

  $(document).ready(function() {
    var canvasElement = document.getElementById('target');
    var socket = null;
    var context = null;
    var socket = io.connect();    
    Identify.Ask(socket, {
      onAuthenticated: function(user) {
        context = new Context(canvasElement, new Demo(socket, canvasElement));           
      }
    }); 
  }); 
});
