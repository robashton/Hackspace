define(function(require) {

  var _ = require('underscore');
  var Item = require('../item');
  var DuckTemplate = require('../items/duck');
  var Pickup = require('../../entities/pickup');

  FetchDucks = {
    init: function() {
      this.itemCount = 0;
    },
    onItemPickedUp: function() {
      this.itemCount = this.entity.get('countOfItemType', [ 'duck' ]);
      this.markUpdated();
      console.log('Item count: ' + this.itemCount);
    },
    onItemRemoved: function() {
      this.itemCount = this.entity.get('countOfItemType', [ 'duck' ]);
      this.markUpdated();
      console.log('Item count: ' + this.itemCount);
    },
    onDiscussion: function(entityId) {
      if(entityId === 'quest-giver') {
        this.determineIfQuestFinished();      
      }
    },
    onKilledTarget: function(targetId) {
      var self = this;
      console.log('Genning item for ' + targetId);
      this.scene.withEntity(targetId, function(target) {
        // Check some value         
        var targetPosition = target.get('getPosition');        
        // TODO: This needs to come via item generation       
        var duck = new Item('duck-' + (Math.random() * 100000) , DuckTemplate);
        self.scene.add(new Pickup(targetPosition[0], targetPosition[1], duck));
      });
    },
    determineIfQuestFinished: function() {
      if(this.itemCount === 5) {
        this.talk('Thanks for finding all my ducks');
        this.removeDucksFromPlayer();
        this.markComplete();
      } else {
       this.talk('Please find my ducks, I miss my ducks');
      }
    },
    removeDucksFromPlayer: function() {
      this.entity.dispatch('removeItemsOfType', [ 'duck' ]);
    },
    talk: function(text) {
      this.entity.raise('TalkTo', {
        id: "quest-giver",
        text: text        
      });
    },
    meta: {
      askText: "Help, please fetch my ducks for me",
      description: "You've been asked to fetch five ducks"
    }
  };
  
  return FetchDucks;    
});
