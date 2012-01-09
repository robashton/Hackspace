define(function() {

  var _ = require('underscore');

  FetchDucks = {
    init: function() {
      this.itemCount = 0;
    },
    onItemPickedUp: function() {
      this.itemCount = this.entity.get('countOfItemType', [ 'duck' ]);
      this.markUpdated();
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
