define(function() {

  var _ = require('underscore');

  FetchDucks = {
    start: function() {
      this.itemCount = 0;
    },
    onItemPickedUp: function() {
      this.itemCount = this.entity.get('countOfItemType', [ 'duck' ]);
    },
    onItemRemoved: function() {
      this.itemCount = this.entity.get('countOfItemType', [ 'duck' ]);
    },
    meta: {
      askText: "Help, please fetch my ducks for me",
      description: "You've been asked to fetch five ducks"
    }
  };
  
  return FetchDucks;    
});
