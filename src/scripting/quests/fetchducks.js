define(function() {

  var _ = require('underscore');

  FetchDucks = {
    init: function() {
      this.itemCount = 0;
      console.log('Duck quest started');
    },
    onItemPickedUp: function() {
      this.itemCount = this.entity.get('countOfItemType', [ 'duck' ]);
      console.log('Duck quest item picked up');
    },
    onItemRemoved: function() {
      this.itemCount = this.entity.get('countOfItemType', [ 'duck' ]);
      console.log('Duck quest item removed');
    },
    onDiscussion: function(entityId) {
      if(entityId === 'quest-giver') {
        this.determineIfQuestFinished();      
      }
    },
    determineIfQuestFinished: function() {
      if(this.itemCount === 5) {
        console.log('Thanks for finding all my ducks');
        this.removeDucksFromPlayer();
        this.markComplete();
      } else {
        console.log('Please find my ducks, I miss my ducks');
      }
    },
    removeDucksFromPlayer: function() {
      this.entity.dispatch('removeItemsOfType', [ 'duck' ]);
    },
    meta: {
      askText: "Help, please fetch my ducks for me",
      description: "You've been asked to fetch five ducks"
    }
  };
  
  return FetchDucks;    
});
