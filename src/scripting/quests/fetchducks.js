define(function(require) {

  var _ = require('underscore');
  var DuckTemplate = require('../items/duck');

  FetchDucks = {
    init: function() {
      this.itemCount = 0;
    },
    onItemPickedUp: function() {
      this.itemCount = this.entity.get('countOfItemType', [ 'duck' ]);
      this.markUpdated();
      console.log('Item picked up', this.itemCount);
    },
    onItemRemoved: function() {
      this.itemCount = this.entity.get('countOfItemType', [ 'duck' ]);
      this.markUpdated();
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
        self.scene.dispatch('god', 'createPickup', [ { 
          template: DuckTemplate, 
          id: 'duck-' + (Math.random() * 100000), 
          x: targetPosition[0], 
          y: targetPosition[1] } ]);
      });
    },
    determineIfQuestFinished: function() {
      if(this.itemCount >= 5) {
        this.talk('Thanks for finding all my ducks');
        this.removeDucksFromPlayer();
        this.markComplete();
      } else {
       this.talk('Please find my ducks, I miss my ducks');
      }
    },
    removeDucksFromPlayer: function() {
      this.scene.dispatch(this.entity.id, 'removeItemsOfType', [ 'duck' ]);
    },
    talk: function(text) {
      this.scene.dispatch(this.entity.id, 'talkTo', ['quest-giver', text]);
    },
    meta: {
      id: 'fetchducks',
      askText: "Help, please fetch my ducks for me",
      description: "You've been asked to fetch five ducks"
    }
  };
  
  return FetchDucks;    
});
