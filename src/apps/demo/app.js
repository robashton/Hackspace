define(function(require) {


  var InputEmitter = require('../../input/inputemitter');
  var InputTranslator = require('../../input/inputtranslator');
  var Context = require('../../harness/context');
  var $ = require('jquery');
  
  var QuestAsker = require('../../ui/questasker');
  var HealthBars = require('../../ui/healthbars');
  var Collider = require('../../entities/collider');
  var God = require('../../entities/god');
  var ClientConnector = require('../../network/clientconnector');
  
  var Identify = require('../../ui/identify');
  var Inventory = require('../../ui/inventory');
  var Quests = require('../../ui/quests');
  var SceneryFader = require('../../entities/sceneryfader');
 
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
      var input = new InputTranslator(context.element);
      var inputEmitter = new InputEmitter(input, context);
      
      var god = new God(context.entityFactory);
      context.scene.add(god);

      
      this.connector = new ClientConnector(this.socket, this.context);
      this.playerId = null;
      
      this.connector.on('PlayerCreated', function(playerId) {
        self.playerId = playerId;
        self.inventory = new Inventory(input, context.scene, playerId);
        self.quests = new Quests(input, context.scene, playerId);
        self.fader = new SceneryFader(context.scene, playerId);
      });
      this.connector.on('GameStarted', function(playerId) {
        self.questAsker = new QuestAsker(context.scene, self.playerId, $('#quest-started'));
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
