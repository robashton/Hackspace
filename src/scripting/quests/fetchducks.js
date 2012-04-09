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
      if(entityId === this.giverid) {
        this.determineIfQuestFinished();      
      }
    },
    onKilledTarget: function(targetId) {
      var self = this;
      console.log('Genning item for ' + targetId);
      this.scene.withEntity(targetId, function(target) {
        // Check some value         
        var targetPosition = target.get('Position');        
        
        // TODO: This needs to come via item generation  
        var item = {};
        _.extend(item, DuckTemplate);
        
        item.id = 'duck-' + parseInt(Math.random() * 1000000);
        self.scene.dispatch('god', 'createPickup', [ {
          item: item,
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
       console.log('Talking');
       this.talk('Please find my ducks, I miss my ducks');
      }
    },
    removeDucksFromPlayer: function() {
      this.scene.dispatch(this.entity.id, 'removeItemsOfType', [ 'duck' ]);
    },
    talk: function(text) {
      this.scene.dispatch(this.entity.id, 'talkTo', ['quest-giver', text]);
    },
    currentDescription: function() {
      return "You have been asked to fetch five ducks for the stick man that is not you";
    },
    meta: {
      id: 'fetchducks',
      title: "The missing ducks",
      askText: "Help, please fetch my ducks for me"
    },
    _out: function(data) {
      data.itemCount = this.itemCount;
      data.description = this.currentDescription();
    },
    _in: function(data) {
      this.itemCount = data.itemCount;
    }
  };
  
  return FetchDucks;    
});
