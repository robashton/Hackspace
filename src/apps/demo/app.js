define(function(require) {


  var InputEmitter = require('../../input/inputemitter');
  var Context = require('../../harness/context');
  var $ = require('jquery');
  
  var QuestAsker = require('../../ui/questasker');
  var HealthBars = require('../../ui/healthbars');
  var Collider = require('../../entities/collider');
  var God = require('../../entities/god');
  var ClientConnector = require('../../network/clientconnector');
 
  var Demo = function(element) {
    this.element = element;
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
      
      this.connector = new ClientConnector(this.context);
      this.connector.on('GameStarted', function(data) {
        self.questAsker = new QuestAsker(context.scene, data.playerid, $('#quest-started'));
      });
    }
  }

  $(document).ready(function() {
    var canvasElement = document.getElementById('target');
    var context = new Context(canvasElement, new Demo(canvasElement));            
  }); 
});
