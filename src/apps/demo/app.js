define(function(require) {


  var InputEmitter = require('../../input/inputemitter');
  var Context = require('../../harness/context');
  var $ = require('jquery');
  
  var QuestAsker = require('../../ui/questasker');
  var HealthBars = require('../../ui/healthbars');
  var Death = require('../../entities/death');
  var Collider = require('../../entities/collider');
  var ClientConnector = require('../../network/clientconnector');
 
  var Demo = function(element) {
    this.element = element;
  };

  Demo.prototype = {
    start: function(context) {          
      this.context = context;      
      var collider = new Collider();
      var healthbars = new HealthBars(this.context);
      context.scene.add(collider);
      var input = new InputEmitter(context);
      this.questAsker = new QuestAsker(context.scene, $('#quest-started'));
      this.death = new Death(context.scene);
      
      this.connector = new ClientConnector(this.context);
    }
  }

  $(document).ready(function() {
    var canvasElement = document.getElementById('target');
    var context = new Context(canvasElement, new Demo(canvasElement));            
  }); 
});
